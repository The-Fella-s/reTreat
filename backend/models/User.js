const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'employee', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },

  // Appointments (For Users & Employees)
  appointments: [
    {
      date: Date,
      time: String,
      service: String,
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // References an Employee
    },
  ],

  // Employee-Specific Fields
  employeeDetails: {
    isAvailable: { type: Boolean, default: true },
    schedule: [
      {
        day: String, // e.g., "Monday"
        startTime: String, // e.g., "09:00 AM"
        endTime: String, // e.g., "05:00 PM"
      },
    ],
  },

  // Admin-Specific Fields (Optional: Future Expansion)
  adminPermissions: {
    canEditUsers: { type: Boolean, default: true },
    canViewReports: { type: Boolean, default: true },
  },
});

// Export the model
module.exports = mongoose.model('User', userSchema);
