const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  try {
    console.log('Incoming Request Body:', req.body);
    let { employee, date, startTime, endTime } = req.body;

    // 🔥 Ensure employee is a valid ObjectId
    try {
      employee = new mongoose.Types.ObjectId(employee);
    } catch (err) {
      return res.status(400).json({ message: "Invalid employee ID format", error: err.message });
    }

    const newSchedule = new Schedule({
      employee,
      date,
      startTime,
      endTime
    });

    await newSchedule.save();
    res.status(201).json({ message: 'Schedule created successfully', schedule: newSchedule });

  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
