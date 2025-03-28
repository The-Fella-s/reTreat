const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utilities/encryption');

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
  // Email verification fields (for initial registration)
  isVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String },
  emailVerificationExpires: { type: Date },
  // Fields for pending email change (for profile update)
  pendingEmail: { type: String },
  pendingEmailVerificationCode: { type: String },
  pendingEmailVerificationExpires: { type: Date },
  // Appointments, employeeDetails, adminPermissions as before…
  appointments: [
    {
      date: Date,
      time: String,
      service: String,
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
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
  adminPermissions: {
    canEditUsers: { type: Boolean, default: true },
    canViewReports: { type: Boolean, default: true },
  },
}, {
  toJSON: { getters: true },
  toObject: { getters: true }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
