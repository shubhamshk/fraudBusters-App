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

// CORS (dev: allow CRA; prod: use CLIENT_ORIGIN or same-origin)
const isProd = process.env.NODE_ENV === 'production';
app.use(
  cors({
    origin: isProd ? (process.env.CLIENT_ORIGIN || false) : true,
    credentials: true,
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

