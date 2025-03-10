const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema({
    uniqueSignups: { type: Number, default: 0 }, // Total unique signups
    dailySignups: { 
        type: Map, 
        of: Number, 
        default: {
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0
        }
    }
});

const Statistics = mongoose.model("Statistics", statisticsSchema);
module.exports = Statistics;
