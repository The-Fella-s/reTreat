const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  role: { type: String, default: 'employee' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', employeeSchema);
