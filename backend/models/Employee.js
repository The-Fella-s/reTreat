const mongoose = require('mongoose');

const customShiftSchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  phone: String,
  email: String,
  schedule: {
    days: { type: [String], required: true },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    customShifts: { type: [customShiftSchema], default: [] },
  },
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
