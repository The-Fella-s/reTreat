// models/InstagramPosts.js
const mongoose = require("mongoose");

const InstagramPostSchema = new mongoose.Schema({
    id: { type: String, unique: true }, // Instagram Post ID
    media_url: String,
    permalink: String,
    fetchedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("InstagramPost", InstagramPostSchema);
