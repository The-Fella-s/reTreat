const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const { protect } = require('../middleware/authMiddleware');

// GET all schedules (for admin or employees)
router.get('/', protect, async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('employee', 'name email');
    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET schedules for a specific employee
router.get('/:employeeId', protect, async (req, res) => {
  try {
    const schedules = await Schedule.find({ employee: req.params.employeeId });
    res.status(200).json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE a new schedule slot (Admin or Employee)
router.post('/', protect, async (req, res) => {
  try {
    const { employee, date, startTime, endTime } = req.body;
    
    const newSchedule = new Schedule({ employee, date, startTime, endTime });
    await newSchedule.save();
    
    res.status(201).json({ message: 'Schedule created successfully', schedule: newSchedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a schedule (e.g., mark as booked)
router.put('/:scheduleId', protect, async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.scheduleId,
      req.body,
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a schedule
router.delete('/:scheduleId', protect, async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.scheduleId);

    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
