# Environment Variables Reference

This document lists all environment variables used throughout the application and where they are referenced.

## 🔑 Required Environment Variables

### MONGODB_URI
- **Location**: `server/.env` 
- **Used in**: `server/index.js:36`
- **Purpose**: MongoDB connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
- **Required**: ✅ YES - Application will exit if not provided

### JWT_SECRET
- **Location**: `server/.env`
- **Used in**: `server/middleware/auth.js:6, 15, 45`
- **Purpose**: Secret key for signing and verifying JWT tokens
- **Format**: Long, random string (minimum 32 characters recommended)
- **Required**: ✅ YES - Application will throw error if not provided

## 📝 Optional Environment Variables

### JWT_EXPIRES_IN
- **Location**: `server/.env`
- **Used in**: `server/middleware/auth.js:16`
- **Purpose**: JWT token expiration time
- **Default**: `7d` (7 days)
- **Format**: String like `7d`, `24h`, `3600s`

### NODE_ENV
- **Location**: `server/.env`
- **Used in**: `server/index.js:17, 30` and `server/middleware/auth.js:25`
- **Purpose**: Environment detection (development/production)
- **Default**: `development`
- **Values**: `development` | `production` | `test`

### PORT
- **Location**: `server/.env`
- **Used in**: `server/index.js:10`
- **Purpose**: Server port number
- **Default**: `5000`
- **Format**: Integer

### CLIENT_ORIGIN
- **Location**: `server/.env`
- **Used in**: `server/index.js:20`
- **Purpose**: CORS origin for production
- **Default**: `false` (allows all origins in dev, restricts in prod)
- **Format**: URL like `http://localhost:3000` or `https://yourdomain.com`

## 🗂️ File Locations

```
server/
├── .env                    ← Main environment file (YOU NEED TO EDIT THIS)
├── .env.example           ← Template file (reference only)
├── .gitignore             ← Excludes .env from git
├── index.js               ← Uses: PORT, NODE_ENV, MONGODB_URI, CLIENT_ORIGIN
├── middleware/auth.js     ← Uses: JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV
└── routes/auth.js         ← Imports auth middleware (indirect usage)
```

## 🔧 Setup Instructions

1. **Edit the file**: `server/.env`
2. **Replace placeholders with your actual values**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A long, secure, random string

## 🚨 Security Notes

- The `server/.env` file is already added to `.gitignore` 
- Never commit actual secrets to git
- Use strong, unique values for JWT_SECRET
- MongoDB URI contains credentials - keep it secure

## ✅ Verification

To verify your environment variables are loaded correctly:

1. Run: `npm run server`
2. Check console output for MongoDB connection success
3. Test auth endpoints to verify JWT_SECRET is working
