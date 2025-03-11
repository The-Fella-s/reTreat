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

module.exports = router;
