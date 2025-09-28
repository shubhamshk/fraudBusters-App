const express = require('express');
const User = require('../models/User');
const { signToken, sendTokenCookie, protect } = require('../middlewares/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, profile } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const validRoles = ['STUDENT', 'EMPLOYER', 'INSTITUTION', 'GOV_ADMIN'];
    if (!validRoles.includes(role))
      return res.status(400).json({ success: false, message: 'Invalid role' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password min 6 chars' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already exists' });

    const user = await User.create({ name, email, password, role, profile: profile || {} });

    const token = signToken(user._id);
    sendTokenCookie(res, token);

    user.password = undefined;
    res.status(201).json({ success: true, message: 'User registered', user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user._id);
    sendTokenCookie(res, token);

    user.password = undefined;
    res.json({ success: true, message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Logout
router.post('/logout', protect, (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
