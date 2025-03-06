const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'employee', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },

  // Profile picture fields
  profilePicture: { type: String },
  profilePictureHash: { type: String },

  // Appointments (For Users & Employees)
  appointments: [
    {
      date: Date,
      time: String,
      service: String,
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],

  // Employee-Specific Fields
  employeeDetails: {
    isAvailable: { type: Boolean, default: true },
    schedule: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
  },

  // Admin-Specific Fields
  adminPermissions: {
    canEditUsers: { type: Boolean, default: true },
    canViewReports: { type: Boolean, default: true },
  },
});

// Prevent model overwrite if model already exists
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
