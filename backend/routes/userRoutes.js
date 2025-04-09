const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');
const { protect, selfOnly } = require('../middleware/authMiddleware');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG and PNG are allowed.'), false);
  }
};
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  next();
};

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// =================== REGISTER ===================
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
    const verificationCode = generateVerificationCode();
    const codeExpiry = Date.now() + 24 * 60 * 60 * 1000;

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || 'user',
      isVerified: false,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: codeExpiry,
    });

    await newUser.save();
    console.log('REGISTER newUser:', newUser);

    const msg = {
      to: newUser.email,
      from: process.env.FROM_EMAIL,
      subject: "Verify Your Email",
      text: `Your verification code is: ${verificationCode}. It expires in 24 hours.`,
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p><p>It expires in 24 hours.</p>`,
    };

    sgMail
      .send(msg)
      .then(() => console.log("Verification email sent using SendGrid."))
      .catch((error) => console.error("Error sending email with SendGrid:", error));

    const token = generateToken(newUser._id, newUser.role);
    res.status(201).json({
      message: 'Registered successfully! Please check your email for a verification code.',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        profilePicture: newUser.profilePicture || '',
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =================== VERIFY EMAIL (Initial Registration) ===================
router.post('/verify-email', async (req, res) => {
  const { userId, code } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }
    if (user.emailVerificationCode !== code || user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    user.isVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =================== VERIFY NEW EMAIL (For Email Change) ===================
router.post('/verify-new-email', async (req, res) => {
  const { userId, code } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.pendingEmail) {
      return res.status(400).json({ message: 'No pending email change found' });
    }
    if (user.pendingEmailVerificationCode !== code || user.pendingEmailVerificationExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.pendingEmailVerificationCode = undefined;
    user.pendingEmailVerificationExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Email updated and verified successfully!' });
  } catch (error) {
    console.error('Error verifying new email:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =================== LOGIN ===================
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
    console.error('LOGIN error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =================== GOOGLE SIGN-ON ===================
router.post('/google-login', async (req, res) => {
  const { email, name, picture, sub } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user if not found (register with Google)
      user = await User.create({
        email,
        name,
        password: sub, // Using Google unique id as a placeholder password
        profilePicture: picture,
        isVerified: true, // Trust Google's verification
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.status(200).json({ token, user });
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// =================== GET PROFILE ===================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('appointments');
    console.log('GET /me user:', user);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// =================== UPDATE PROFILE ===================
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
      
      user.name = name || user.name;
      user.phone = phone || user.phone;
      
      // Handle email change
      if (email && email !== user.email) {
        user.pendingEmail = email;
        const newEmailCode = generateVerificationCode();
        user.pendingEmailVerificationCode = newEmailCode;
        user.pendingEmailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
        const msg = {
          to: email,
          from: process.env.FROM_EMAIL,
          subject: "Verify Your New Email",
          text: `Your verification code is: ${newEmailCode}. It expires in 24 hours.`,
          html: `<p>Your verification code is: <strong>${newEmailCode}</strong></p><p>It expires in 24 hours.</p>`,
        };
        sgMail
          .send(msg)
          .then(() => console.log("New email verification sent."))
          .catch((error) => console.error("Error sending new email verification:", error));
      }
      
      // Handle profile picture update (existing logic)
      if (req.file) {
        const newFilePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        const fileBuffer = fs.readFileSync(newFilePath);
        const newFileHash = crypto.createHash('md5').update(fileBuffer).digest('hex');
        console.log('UPDATE-PROFILE: new file hash:', newFileHash);
        if (user.profilePicture) {
          if (user.profilePictureHash && user.profilePictureHash === newFileHash) {
            console.log('UPDATE-PROFILE: new file is a duplicate; removing it');
            fs.unlinkSync(newFilePath);
          } else {
            const oldFilePath = path.join(__dirname, '..', user.profilePicture);
            console.log('UPDATE-PROFILE: removing old file if exists:', oldFilePath);
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
            user.profilePicture = `/uploads/${req.file.filename}`;
            user.profilePictureHash = newFileHash;
            console.log('UPDATE-PROFILE: set new file path & hash');
          }
        } else {
          console.log('UPDATE-PROFILE: user has no existing profile picture; setting new one');
          user.profilePicture = `/uploads/${req.file.filename}`;
          user.profilePictureHash = newFileHash;
        }
      }
      
      console.log('UPDATE-PROFILE: BEFORE save:', user);
      const updatedUser = await user.save();
      console.log('UPDATE-PROFILE: AFTER save:', updatedUser);
      res.status(200).json({
        message: 'Profile updated successfully. If you changed your email, please verify it using the code sent to your new address.',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          profilePicture: updatedUser.profilePicture || '',
          pendingEmail: updatedUser.pendingEmail || null,
          isVerified: updatedUser.isVerified,
        },
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Search for users by name
router.get('/search', protect, async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name query parameter is required.' });
    }

    // Find users whose name matches the search term (case-insensitive)
    const users = await User.find({
      name: { $regex: name, $options: 'i' }
    }).select('-password'); // Exclude password from results

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found with that name.' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Returns all users (without passwords)
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);  // This ensures a JSON response.
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Update the user with the new data
router.put('/:id', protect, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update allowed fields. If you haven't permitted role update, add this.
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    // If you want to allow role updates, explicitly update it:
    if (req.body.role) {
      user.role = req.body.role;
    }
    // If there are other fields you want to update, include them accordingly.

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
