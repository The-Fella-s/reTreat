const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Test Route
router.get('/', (req, res) => {
  res.send('Employee API is running');
});

module.exports = router;
