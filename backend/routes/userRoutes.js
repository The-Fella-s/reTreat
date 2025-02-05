const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/users/register-client
router.post('/register-client', async (req, res) => {
  const { email, password, name } = req.body;

  try {
      // Validate input
      if (!email || !password || !name) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      // Check for duplicate email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create and save the new user
      const newUser = new User({
          email,
          password: hashedPassword,
          name,
      });

      console.log('Saving user:', newUser); // Add this for debugging

      await newUser.save();

      // Respond with success
      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/login-client
router.post('/login-client', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', { email, password }); // Log input

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found'); // Log if user doesn't exist
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', user); // Log found user

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password'); // Log if password is incorrect
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Password matched!'); // Log successful password match

    // Generate JWT token
    const payload = {
      user: {
        id: user._id,  // User's ObjectID from MongoDB
        email: user.email
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('JWT generated:', token); // Log the generated token

    // Return token on success
    res.status(200).json({ token, message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
