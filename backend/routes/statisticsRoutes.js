const express = require('express');
const router = express.Router();
import User from '../models/userModel.js';

router.get("./fetch", async (req, res) => {
    try {
        await fetchStatistics();
        res.status(200).json({ message: "Statistics fetched" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function fetchStatistics() {
    try {
        // Fetch statistics
    } catch (error) {
        console.error("Error fetching statistics:", error);
        throw error;
    }

    const totalUsers = await User.countDocuments(); 
}   

module.exports=router;