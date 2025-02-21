const express = require("express");
const passport = require("passport");
const axios = require("axios");
const User = require("../models/instagramBusinessAccount");

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

// Route to fetch Instagram posts
router.get("/posts", async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user || !user.pageAccessToken || !user.igBusinessAccountId) {
      return res.status(401).json({ error: "No valid access token found" });
    }

    // Fetch media posts from Instagram Business Account
    const response = await axios.get(`https://graph.facebook.com/v22.0/${user.igBusinessAccountId}/media`, {
      params: { fields: "id,media_url,permalink", access_token: user.pageAccessToken }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Instagram API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch Instagram posts", details: error.response ? error.response.data : error.message });
  }
});

module.exports = router;
