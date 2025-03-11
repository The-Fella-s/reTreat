const express = require("express");
const router = express.Router();
const Statistics = require("../models/Statistics");


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

// Function to get the current day of the week
const getCurrentDay = () => {
    return new Date().toLocaleString("en-US", { weekday: "long" });
};

// Get Unique Signups & Daily Data
router.get("/", async (req, res) => {
    try {
        const stats = await Statistics.findOne();
        if (!stats) {
            return res.json({ uniqueSignups: 0, dailySignups: {} });
        }
        res.json({ uniqueSignups: stats.uniqueSignups, dailySignups: stats.dailySignups });
    } catch (error) {
        res.status(500).json({ message: "Error fetching statistics", error });
    }
});

// Update Unique Signups and Track Signups by Day
router.post("/update-signups", async (req, res) => {
    try {
        const today = getCurrentDay(); // Get today's day (Monday, Tuesday, etc.)

        const stats = await Statistics.findOneAndUpdate(
            {}, 
            { 
                $inc: { 
                    uniqueSignups: 1, 
                    [`dailySignups.${today}`]: 1  // Increment today's signup count
                } 
            }, 
            { new: true, upsert: true }
        );

        res.json({ message: "Signup statistics updated", uniqueSignups: stats.uniqueSignups, dailySignups: stats.dailySignups });
    } catch (error) {
        res.status(500).json({ message: "Error updating signups", error });
    }
});

//  Reset Unique Signups & Daily Signups
router.post("/reset-signups", async (req, res) => {
    try {
        const resetStats = await Statistics.findOneAndUpdate(
            {}, 
            { 
                uniqueSignups: 0, 
                dailySignups: {
                    Monday: 0,
                    Tuesday: 0,
                    Wednesday: 0,
                    Thursday: 0,
                    Friday: 0,
                    Saturday: 0,
                    Sunday: 0
                }
            }, 
            { new: true, upsert: true }
        );

        res.json({ message: "Signups reset successfully", uniqueSignups: resetStats.uniqueSignups, dailySignups: resetStats.dailySignups });
    } catch (error) {
        res.status(500).json({ message: "Error resetting signups", error });
    }
});


module.exports = router;
