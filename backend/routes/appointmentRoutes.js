const express = require('express');
const Appointment = require('../models/Appointment');

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
      const appointments = await Appointment.find(); 
      res.status(200).json(appointments); // Return as JSON format
  } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add new appointments
router.post('/populate', async (req, res) => {
  try {
    const appointments = req.body.appointments; // Expecting {appointments: [...]}

    if (!appointments || appointments.length === 0) {
      return res.status(400).json({ message: 'No data provided' });
    }

    // Insert appointments into MongoDB
    await Appointment.insertMany(appointments);
    res.status(201).json({ message: 'Appointments populated successfully' });
  } catch (error) {
    console.error('Error populating database:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
