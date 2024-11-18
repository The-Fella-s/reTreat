const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Test Route
router.get('/', (req, res) => {
  res.send('User API is running');
});

module.exports = router;
