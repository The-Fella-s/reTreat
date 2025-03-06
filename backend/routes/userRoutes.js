const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const User = require('../models/user');
const { protect, selfOnly } = require('../middleware/authMiddleware');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Configure Multer for Local File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
  },
});

// File Filter for JPG/PNG
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG and PNG are allowed.'), false);
  }
};

// Set max file size to 5MB
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// Multer error-handling middleware
const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next();
};


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
      role: role || 'user',
    });

    await newUser.save();
    console.log('REGISTER newUser:', newUser);

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    console.log('LOGIN user found:', user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);
    console.log('LOGIN success, token generated:', token);

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

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('appointments');
    console.log('GET /me user:', user);

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put(
  '/update-profile/:id',
  protect,
  selfOnly,
  upload.single('profilePicture'),
  multerErrorHandler,
  async (req, res) => {
    console.log('UPDATE-PROFILE route hit for userID:', req.params.id);
    const { name, phone, email } = req.body;

    try {
      const user = await User.findById(req.params.id);
      console.log('UPDATE-PROFILE: user found:', user);

      if (!user) return res.status(404).json({ message: 'User not found' });

      // Update text fields
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.email = email || user.email;

      if (req.file) {
        // Build the new file's full path
        const newFilePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        // Compute MD5 hash of the new file
        const fileBuffer = fs.readFileSync(newFilePath);
        const newFileHash = crypto.createHash('md5').update(fileBuffer).digest('hex');

        console.log('UPDATE-PROFILE: new file hash:', newFileHash);

        if (user.profilePicture) {
          // There's an existing file
          if (user.profilePictureHash && user.profilePictureHash === newFileHash) {
            // Duplicate file: remove the newly uploaded file
            console.log('UPDATE-PROFILE: new file is a duplicate; removing it');
            fs.unlinkSync(newFilePath);
          } else {
            // Different file: remove old file if it exists
            const oldFilePath = path.join(__dirname, '..', user.profilePicture);
            console.log('UPDATE-PROFILE: removing old file if exists:', oldFilePath);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
            // Update the user record
            user.profilePicture = `/uploads/${req.file.filename}`;
            user.profilePictureHash = newFileHash;
            console.log('UPDATE-PROFILE: set new file path & hash');
          }
        } else {
          // No existing profile picture
          console.log('UPDATE-PROFILE: user has no existing profile picture; setting new one');
          user.profilePicture = `/uploads/${req.file.filename}`;
          user.profilePictureHash = newFileHash;
        }
      }

      console.log('UPDATE-PROFILE: BEFORE save:', user);
      const updatedUser = await user.save();
      console.log('UPDATE-PROFILE: AFTER save:', updatedUser);

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
  }
);

module.exports = router;
