const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// CREATE a new review
router.post('/', async (req, res) => {
  try {
    const { userId, appointmentId, rating, comment } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    // Ensure the appointment document has a valid user value.
    if (!appointment.user || appointment.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to review this appointment.' });
    }
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Appointment must be completed to leave a review.' });
    }
    const review = await Review.create({ user: userId, appointment: appointmentId, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE an existing review
router.put('/:reviewId', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this review.' });
    }
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an existing review
router.delete('/:reviewId', async (req, res) => {
  try {
    const { userId } = req.body;
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review.' });
    }
    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
