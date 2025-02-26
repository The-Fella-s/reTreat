const axios = require("axios");
const User = require("../models/instagramBusinessAccount");
require("dotenv").config();

// Function to refresh tokens for a given user
async function refreshTokensForUser(user) {
    try {
        // Exchange the current short-lived or expiring long-lived user access token for a fresh long-lived token.
        const tokenResponse = await axios.get("https://graph.facebook.com/v22.0/oauth/access_token", {
            params: {
                grant_type: "fb_exchange_token",
                client_id: process.env.INSTAGRAM_APP_ID,
                client_secret: process.env.INSTAGRAM_APP_SECRET,
                fb_exchange_token: user.accessToken
            }
        });
        const newAccessToken = tokenResponse.data.access_token;

        // Optionally: You might have an 'expires_in' value in the response which you can use to update your expiration logic.
        // e.g., const expiresIn = tokenResponse.data.expires_in;

        // Now, refresh the pageAccessToken as well.
        // Depending on your flow, you might need to re-fetch the connected pages to get the new page token.
        const pagesResponse = await axios.get("https://graph.facebook.com/v22.0/me/accounts", {
            params: { access_token: newAccessToken }
        });
        if (!pagesResponse.data.data || !pagesResponse.data.data.length) {
            throw new Error("No connected Facebook pages found during token refresh");
        }
        const page = pagesResponse.data.data[0];

        // Update user tokens and timestamp in your database
        user.accessToken = newAccessToken;
        user.pageAccessToken = page.access_token;
        user.generatedAt = new Date();

        await user.save();
        console.log(`Tokens refreshed for Instagram ID: ${user.instagramId}`);
    } catch (error) {
        console.error(`Error refreshing tokens for Instagram ID ${user.instagramId}:`, error.message);
    }
}

// Refresh tokens for users whose tokens are nearing expiration
async function refreshTokens() {
    try {
        // Calculate threshold: refresh tokens 2 days before they expire (for a 60-day token validity)
        const THRESHOLD_DAYS = 58;
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - THRESHOLD_DAYS);

        // Query only users whose tokens were generated before the threshold date
        const users = await User.find({ generatedAt: { $lte: thresholdDate } });

        for (const user of users) {
            await refreshTokensForUser(user);
        }
    } catch (error) {
        console.error("Error in token refresh process:", error.message);
    }
}

module.exports = { refreshTokens, refreshTokensForUser };
