const mongoose = require('mongoose');

const WaiverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  dateSigned: {
    type: Date,
    default: Date.now,
  },
  documentUrl: {
    type: String,
    required: true, // e.g., link to the signed PDF
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Waiver', WaiverSchema);
