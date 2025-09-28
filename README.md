# File Verification App

A comprehensive certificate verification system with authentication, built with React frontend and Express backend.

## 🏗️ Project Structure

```
file-verification-app/
├── frontend/                 # React client application
│   ├── src/
│   │   ├── components/      # React components (Login, Register, etc.)
│   │   ├── api/            # API helper functions
│   │   └── App.js          # Main React app
│   ├── public/             # Static files
│   └── package.json        # Frontend dependencies
│
├── backend/                 # Express server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── .env                # Environment variables (MongoDB URI, JWT secret)
│   └── package.json        # Backend dependencies
│
├── package.json            # Root package.json with scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)

### 1. Install Dependencies
```bash
npm install                 # Install root dependencies
npm run install-all        # Install frontend & backend dependencies
```

### 2. Configure Environment Variables
Edit `backend/.env` with your credentials:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
JWT_SECRET=your-long-random-secret-key-here
```

### 3. Start Development
```bash
npm run dev                 # Starts both frontend (port 3000) and backend (port 5000)
```

## 📋 Available Scripts

### Root Scripts
- `npm run dev` - Start both frontend and backend concurrently
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run build` - Build frontend for production

### Frontend Scripts (from `/frontend`)
- `npm start` - Start React development server
- `npm run build` - Create production build
- `npm test` - Run tests

### Backend Scripts (from `/backend`)
- `npm run dev` - Start server with nodemon (auto-restart)
- `npm start` - Start server in production mode

## 🔐 Features

- **Authentication System**: User registration/login with JWT
- **File Verification**: Certificate analysis and fraud detection
- **Security**: Password hashing, CORS protection, secure cookies
- **Modern Stack**: React + Express + MongoDB

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (requires role selection)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Certificate Operations
- `POST /api/certificates/verify` - Verify certificate (Student, Employer)
- `POST /api/certificates/bulk-verify` - Bulk verify certificates (Employer only)
- `POST /api/certificates/issue` - Issue new certificate (Institution only)
- `POST /api/certificates/bulk-issue` - Bulk issue certificates (Institution only)
- `PUT /api/certificates/:id/revoke` - Revoke certificate (Institution only)
- `GET /api/certificates/user-history` - Get user's verification history

### Government Admin Only
- `GET /api/certificates/analytics` - System-wide analytics
- `POST /api/certificates/blacklist` - Add entity to blacklist

### System
- `GET /api/health` - Server status

## 🧪 Test Users (After Migration)

The migration script creates test users for each role:

- **Student**: `student@test.com` / `password123`
- **Employer**: `employer@test.com` / `password123`
- **Institution**: `institution@test.com` / `password123`
- **Gov Admin**: `govadmin@test.com` / `password123`

## 🚀 Development Workflow

1. **Setup**: Clone repo, install dependencies, configure `.env`
2. **Migration**: Run `npm run migrate` to setup database with roles
3. **Development**: Use `npm run dev` to start both frontend and backend
4. **Testing**: Run `npm test` in backend folder for role-based auth tests
5. **Registration**: Create new users with role selection in the UI
6. **Dashboard Access**: Each role gets redirected to their specific dashboard
