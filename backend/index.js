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

// ----------------------
// CORS configuration
// ----------------------
const allowedOrigins = [
  'https://fraudbusters-frontend.onrender.com', // your frontend
  /\.onrender\.com$/, // allow any Render subdomain
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow tools like Postman
      if (allowedOrigins.some(o => (typeof o === 'string' ? o === origin : o.test(origin)))) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ----------------------
// Routes
// ----------------------
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// ----------------------
// Global error handler
// ----------------------
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res
    .status(500)
    .json({ success: false, error: err.message || 'Internal Server Error' });
});

// ----------------------
// Mongo connection & server start
// ----------------------
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
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Auth API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();

// Export app for testing
module.exports = app;
