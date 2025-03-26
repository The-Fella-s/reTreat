const express = require('express');
const router = express.Router();
const WebsiteVisit = require('../models/WebsiteVisit');

// Track website visit for today only
router.post('/track', async (req, res) => {
    try {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const currentDay = days[new Date().getDay()]; // Get the current day

        let visitDoc = await WebsiteVisit.findOne();
        if (!visitDoc) {
            visitDoc = new WebsiteVisit({
                totalVisits: 1,
                dailyVisits: { [currentDay]: 1 } // Only update today
            });
        } else {
            visitDoc.totalVisits += 1;
            visitDoc.dailyVisits[currentDay] = (visitDoc.dailyVisits[currentDay] || 0) + 1; // Only update today
        }

        await visitDoc.save();
        res.json({ success: true, totalVisits: visitDoc.totalVisits, dailyVisits: visitDoc.dailyVisits });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// Get website visit data
router.get('/get', async (req, res) => {
    try {
        const visitDoc = await WebsiteVisit.findOne() || { totalVisits: 0, dailyVisits: {} };
        res.json({ success: true, totalVisits: visitDoc.totalVisits, dailyVisits: visitDoc.dailyVisits });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Reset website visits and dailyVisits
router.post('/reset', async (req, res) => {
    try {
        const resetDoc = await WebsiteVisit.findOneAndUpdate(
            {},
            {
                totalVisits: 0,
                dailyVisits: {
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

        res.json({
            success: true,
            message: 'Website visits reset successfully.',
            totalVisits: resetDoc.totalVisits,
            dailyVisits: resetDoc.dailyVisits
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to reset website visits', error: error.message });
    }
});


module.exports = router;
