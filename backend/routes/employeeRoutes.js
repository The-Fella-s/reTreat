const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); 

// Route to get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees); // Send back a list of employees
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to add a new employee
router.post('/', async (req, res) => {
  const { firstName, lastName, address, phone, schedule, email } = req.body;

  // Check if the email already exists
  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newEmployee = new Employee({
    firstName,
    lastName,
    address,
    phone,
    schedule,
    email
  });

  try {
    const employee = await newEmployee.save();
    res.status(201).json(employee); // Respond with the newly added employee
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update an employee by ID
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(employee); // Send back the updated employee
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete an employee by ID
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' }); // Confirm deletion
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
