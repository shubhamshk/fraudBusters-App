const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Get JWT secret from env
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');
  return secret;
};

// Generate JWT token
const signToken = (userId) => {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Send JWT as httpOnly cookie
const sendTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction,          // only HTTPS in production
    sameSite: isProduction ? 'None' : 'Lax', // cross-site cookies in prod
  });
};

// Protect middleware
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ success: false, message: 'Not authenticated' });

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError')
      return res.status(401).json({ success: false, message: 'Invalid token' });
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ success: false, message: 'Token expired' });
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: `Access denied for role ${req.user.role}` });
    next();
  };
};

module.exports = { signToken, sendTokenCookie, protect, authorize };
