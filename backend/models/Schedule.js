const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References Employee (who has role: "employee")
    required: true
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g., "09:00 AM"
  endTime: { type: String, required: true }, // e.g., "05:00 PM"
  isBooked: { type: Boolean, default: false },
  appointment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment', 
    default: null 
  }, // Link to appointment if booked
});

module.exports = mongoose.model('Schedule', scheduleSchema);
