const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure proper import case

const protect = async (req, res, next) => {
  // Check for token in the 'Authorization' header
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get the token
  console.log('Authorization token:', token);
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data from the token to req.user
    req.user = decoded;

    // Fetch the full user details from the DB based on the decoded user ID
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user's role and profile to the req.user object
    req.user.role = user.role;
    req.user.profile = user; // Attach full profile data to the request

    next(); // Call the next middleware or route handler
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
