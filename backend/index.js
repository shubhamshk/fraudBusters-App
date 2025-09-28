require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const certificateRoutes = require('./routes/certificates');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration for development and production
const isProd = process.env.NODE_ENV === 'production';

let corsOrigin;
if (isProd) {
  // In production, use CLIENT_ORIGIN if provided, otherwise allow specific origins
  corsOrigin = process.env.CLIENT_ORIGIN || [
    /\.onrender\.com$/,
    'https://fraudbusters-frontend.onrender.com'
  ];
} else {
  // In development, allow all origins
  corsOrigin = true;
}

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// Mongo connection
(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('Missing MONGODB_URI in environment');
      process.exit(1);
    }
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Auth API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();

// Export app for testing
module.exports = app;

