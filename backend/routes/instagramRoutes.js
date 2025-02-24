const express = require("express");
const passport = require("passport");
const axios = require("axios");
const User = require("../models/instagramBusinessAccount");
const InstagramPosts = require("../models/InstagramPosts");

const router = express.Router();

// Route to initiate Instagram OAuth flow
router.get("/auth", passport.authenticate("oauth2", { session: false }));

// Route for handling Instagram OAuth callback
router.get("/callback", passport.authenticate("oauth2", { failureRedirect: "/", session: false }), (req, res) => {
  if (!req.user || !req.user.accessToken || !req.user.instagramId) {
    return res.status(400).json({ error: "Authentication failed" });
  }
  res.redirect("http://localhost:5173/");
});

// Cache expiration time, 1 hour by default
const CACHE_EXPIRATION_MS = 1000 * 60 * 60;

// Route to fetch Instagram posts with caching logic
router.get("/posts", async (req, res) => {
  try {

    // Get the user and ensure required tokens/IDs are available
    const user = await User.findOne();
    if (!user || !user.pageAccessToken || !user.igBusinessAccountId) {
      return res.status(401).json({ error: "No valid access token found" });
    }

    const now = new Date();

    // Check if we have cached posts in the database
    let cachedPosts = await InstagramPosts.find({});

    // If there are cached posts, check if they are still fresh.
    if (cachedPosts.length > 0) {

      // Check age of cache
      const cacheAge = now - cachedPosts[0].fetchedAt;
      if (cacheAge < CACHE_EXPIRATION_MS) {

        // Cache is still valid; return cached posts
        return res.json({ data: cachedPosts, source: "cache" });
      }
    }

    // If no cached posts, fetch posts from the Instagram API
    const response = await axios.get(
        `https://graph.facebook.com/v22.0/${user.igBusinessAccountId}/media`,
        {
          params: {
            fields: "id,media_url,permalink",
            access_token: user.pageAccessToken
          }
        }
    );

    const postsFromApi = response.data.data;

    // Clear old cache if it exists
    await InstagramPosts.deleteMany({});

    // Prepare the posts with the current timestamp for caching
    const postsToCache = postsFromApi.map(post => ({
      id: post.id,
      media_url: post.media_url,
      permalink: post.permalink,
      fetchedAt: now
    }));

    const bulkOps = postsFromApi.map(post => ({
      updateOne: {
        filter: { id: post.id },
        update: {
          $set: {
            media_url: post.media_url,
            permalink: post.permalink,
            fetchedAt: now
          }
        },
        upsert: true
      }
    }));

    await InstagramPosts.bulkWrite(bulkOps);

    // Return the fresh data
    res.json({ data: postsToCache, source: "api" });
  } catch (error) {
    console.error("Instagram API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({
      error: "Failed to fetch Instagram posts",
      details: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
