const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  schedule: { type: String, required: true },
  email: { type: String, unique: true, required: true }  
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
