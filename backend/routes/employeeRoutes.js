const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as needed
const Profession = require('../models/Profession'); // New Profession model
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET all employees (users with role 'employee')
router.get('/', protect, async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .populate('employeeDetails.profession');
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new employee. Only admins can add employees.
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { firstName, lastName, address, phone, email, profession } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: 'First name, last name, and email are required'
      });
    }

    // Check for profession; create new Profession if it does not exist.
    let professionId = null;
    if (profession && profession.trim()) {
      const professionName = profession.trim();
      let profDoc = await Profession.findOne({ name: professionName });
      if (!profDoc) {
        profDoc = await Profession.create({ name: professionName });
      }
      professionId = profDoc._id;
    }

    const employeeData = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      address, // expects an object { street, city, state, postalCode, country }
      phone,
      email,
      role: 'employee',
      employeeDetails: {
        profession: professionId // This will be an ObjectId or null
      }
    };

    const newEmployee = await User.create(employeeData);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an existing employee if the user is an admin OR if the user is updating their own profile.
router.put('/:id', protect, async (req, res) => {
  try {
    // Authorization: only admin or the owner can update
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        message: 'Access Denied: Only admins or owner can update profile'
      });
    }

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Save old profession ID for later comparison.
    const oldProfessionId = employee.employeeDetails ? employee.employeeDetails.profession : null;

    // Update allowed fields
    employee.firstName = req.body.firstName || employee.firstName;
    employee.lastName = req.body.lastName || employee.lastName;
    employee.name = `${employee.firstName} ${employee.lastName}`;
    employee.address = req.body.address || employee.address;
    employee.phone = req.body.phone || employee.phone;
    employee.email = req.body.email || employee.email;

    // Process profession update
    if (req.body.profession !== undefined) {
      if (req.body.profession && req.body.profession.trim()) {
        const professionName = req.body.profession.trim();
        let profDoc = await Profession.findOne({ name: professionName });
        if (!profDoc) {
          profDoc = await Profession.create({ name: professionName });
        }
        if (!employee.employeeDetails) {
          employee.employeeDetails = {};
        }
        employee.employeeDetails.profession = profDoc._id;
      } else {
        // Clear the profession if an empty value is provided.
        if (employee.employeeDetails) {
          employee.employeeDetails.profession = undefined;
        }
      }
    }

    // Ensure the role remains 'employee'
    employee.role = 'employee';

    const updatedEmployee = await employee.save();

    // Check if the profession does not have employees, if not, delete it
    const newProfessionId = employee.employeeDetails ? employee.employeeDetails.profession : null;
    if (oldProfessionId && oldProfessionId.toString() !== (newProfessionId || '').toString()) {
      const count = await User.countDocuments({ 'employeeDetails.profession': oldProfessionId });
      if (count === 0) {
        await Profession.findByIdAndDelete(oldProfessionId);
      }
    }

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an employee. Only admins can delete.
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Store the profession ID before deletion.
    const professionId = employee.employeeDetails ? employee.employeeDetails.profession : null;

    await employee.remove();

    // Check if the profession does not have employees, if not, delete it
    if (professionId) {
      const count = await User.countDocuments({ 'employeeDetails.profession': professionId });
      if (count === 0) {
        await Profession.findByIdAndDelete(professionId);
      }
    }

    res.json({ message: 'Employee removed' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
