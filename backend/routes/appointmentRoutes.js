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

// Ensures that backend route checks for an empty database if configuring through MongoDB Compass
router.get('/check-existence', async (req, res) => {
  try {
      const existingAppointments = await Appointment.find();
      if (existingAppointments.length > 0) {
          return res.json({ exists: true });
      } else {
          return res.json({ exists: false });
      }
  } catch (error) {
      console.error('Error checking existence:', error);
      res.status(500).json({ error: 'Server error' });
  }
});


// Add new appointments
router.post('/populate', async (req, res) => {
  try {
    const { appointments } = req.body;

    // Loop through the appointments and upsert by 'name' to avoid duplicates
    const promises = appointments.map(async (appointment) => {
      // Upsert operation: If the appointment exists by 'name', it gets updated, otherwise inserted
      await Appointment.updateOne(
        { name: appointment.name },  // Matching the 'name' field
        { $set: appointment },  // Set new data
        { upsert: true }  // Upsert option
      );
    });

    // Wait for all upsert operations to complete
    await Promise.all(promises);

    res.status(201).json({ message: 'Appointments populated successfully' });
  } catch (error) {
    console.error('Error populating appointments:', error);
    res.status(500).json({ error: 'Error populating appointments' });
  }
});

// Delete an appointment by its ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Appointment.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;