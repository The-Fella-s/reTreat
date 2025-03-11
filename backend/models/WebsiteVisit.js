const mongoose = require('mongoose');

const WebsiteVisitSchema = new mongoose.Schema({
    totalVisits: { type: Number, default: 0 },
    dailyVisits: {
        Monday: { type: Number, default: 0 },
        Tuesday: { type: Number, default: 0 },
        Wednesday: { type: Number, default: 0 },
        Thursday: { type: Number, default: 0 },
        Friday: { type: Number, default: 0 },
        Saturday: { type: Number, default: 0 },
        Sunday: { type: Number, default: 0 }
    }
});

const WebsiteVisit = mongoose.model('WebsiteVisit', WebsiteVisitSchema);
module.exports = WebsiteVisit;
