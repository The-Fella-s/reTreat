const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { protect, adminOnly, selfOnly } = require('../middleware/authMiddleware');
const multer = require('multer');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Configure Multer for Profile Picture Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ **Register a New User**
router.post('/register', async (req, res) => {
  const { email, password, name, phone, role } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || 'user', // Default to "user"
    });

    await newUser.save();
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: `New ${role || 'user'} registered successfully!`,
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        profilePicture: newUser.profilePicture || '',
      },
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ **Login User**
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture || '',
      },
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ **Get User Profile (Self Only)**
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('appointments');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ **Update User Profile**
router.put('/update-profile/:id', protect, selfOnly, upload.single('profilePicture'), async (req, res) => {
  const { name, phone, email } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.email = email || user.email;

    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        profilePicture: updatedUser.profilePicture || '',
      },
    });

  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
