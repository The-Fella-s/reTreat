const mongoose = require('mongoose');
const { encrypt, decrypt }  = require('../utilities/encryption')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'employee', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  squareId: {
    type: String,
    unique: true,
    set: encrypt,
    get: decrypt,
  },
  cardId: {
    type: String,
    unique: true,
    set: encrypt,
    get: decrypt,
  },

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
}, {
  toJSON: { getters: true },   // enable getters when converting to JSON
  toObject: { getters: true }  // enable getters when converting to plain objects
});

// Prevent model overwrite if model already exists
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
