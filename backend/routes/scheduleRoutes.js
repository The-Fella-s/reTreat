const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schedule = require('../models/Schedule');
const { protect, employeeOnly } = require('../middleware/authMiddleware');

// GET All Schedules (Employees Only)
router.get('/', protect, employeeOnly, async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('employee', 'name email');
    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET Employee-Specific Schedules (Employees Only)
router.get('/my-schedules', protect, employeeOnly, async (req, res) => {
  try {
    const schedules = await Schedule.find({ employee: req.user.id });
    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE New Schedule (Employees Only)
router.post('/', protect, employeeOnly, async (req, res) => {
  try {
    console.log('Incoming Request Body:', req.body);
    let { date, startTime, endTime } = req.body;
    const employee = req.user.id; // Automatically assign logged-in employee

    // Validate Time Format (12-hour)
    const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ message: 'Invalid time format. Use HH:MM AM/PM' });
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

// UPDATE Schedule (Employees Only)
router.put('/:scheduleId', protect, employeeOnly, async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { _id: req.params.scheduleId, employee: req.user.id }, // Ensure employee only updates their schedule
      req.body,
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found or not authorized to edit' });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE Schedule (Employees Only)
router.delete('/:scheduleId', protect, employeeOnly, async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findOneAndDelete({
      _id: req.params.scheduleId,
      employee: req.user.id // Only allow employees to delete their own schedules
    });

    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule not found or not authorized to delete' });
    }

    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
