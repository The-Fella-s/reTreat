// backend/models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName:     { type: String, required: true },
  lastName:      { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  phone:         { type: String },
  profession:    { type: String },
  description:   { type: String },               // ← new bio/description field
  address:       { type: String },
  profilePicture:{ type: String },               // stores the S3 URL
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
