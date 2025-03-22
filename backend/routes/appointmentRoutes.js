const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// GET all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET appointment by ID
router.get('/:appointmentId', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create a new appointment
router.post('/', async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
