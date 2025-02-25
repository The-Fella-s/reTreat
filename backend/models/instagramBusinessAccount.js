const mongoose = require('mongoose');

const InstagramBusinessAccountSchema = new mongoose.Schema({
    instagramId: String,        // Facebook user ID
    accessToken: String,        // User access token
    pageAccessToken: String,    // Page Access Token needed for Instagram API calls
    igBusinessAccountId: String, // Instagram Business Account ID from the connected Facebook Page
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("InstagramBusinessAccount", InstagramBusinessAccountSchema);
