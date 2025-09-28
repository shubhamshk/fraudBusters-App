const express = require('express');
const User = require('../models/User');
const { signToken, sendTokenCookie, protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, profile } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role',
      });
    }

    // Validate role
    const validRoles = ['STUDENT', 'EMPLOYER', 'INSTITUTION', 'GOV_ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role selected',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      profile: profile || {},
    });

    // Generate token and send cookie
    const token = signToken(user._id);
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token and send cookie
    const token = signToken(user._id);
    sendTokenCookie(res, token);

    // Remove password from response
    user.password = undefined;

    res.json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;
