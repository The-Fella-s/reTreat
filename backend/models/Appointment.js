const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  pricing: { type: Number, required: true },
  duration: { type: Number, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
