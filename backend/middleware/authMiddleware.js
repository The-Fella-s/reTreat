const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure proper import case

const protect = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;

    // Fetch full user details from DB
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user.role = user.role; // Ensure role is set
    req.user.profile = user; // Attach full profile data to the request

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

// Restrict Access to Employees Only
const employeeOnly = (req, res, next) => {
  if (req.user && req.user.role === 'employee') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Employees Only' });
  }
};

// Restrict Access to Admins Only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Admins Only' });
  }
};

// Restrict Access to Self-Only Profile Updates
const selfOnly = (req, res, next) => {
  if (req.user && req.user.id === req.params.id) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: You can only update your own profile' });
  }
};

module.exports = { protect, employeeOnly, adminOnly, selfOnly };
