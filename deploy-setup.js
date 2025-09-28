#!/usr/bin/env node

/**
 * Deployment Setup Script
 * Prepares the project for production deployment on Render
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up project for production deployment...\n');

// 1. Update backend package.json for production
const backendPackagePath = path.join(__dirname, 'backend', 'package.json');
if (fs.existsSync(backendPackagePath)) {
  const backendPackage = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  
  // Add engines field for Node.js version
  backendPackage.engines = {
    node: ">=16.0.0",
    npm: ">=7.0.0"
  };
  
  // Ensure start script exists
  if (!backendPackage.scripts.start) {
    backendPackage.scripts.start = "node index.js";
  }
  
  fs.writeFileSync(backendPackagePath, JSON.stringify(backendPackage, null, 2));
  console.log('✅ Backend package.json updated');
}

// 2. Update frontend package.json for production
const frontendPackagePath = path.join(__dirname, 'frontend', 'package.json');
if (fs.existsSync(frontendPackagePath)) {
  const frontendPackage = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
  
  // Add engines field
  frontendPackage.engines = {
    node: ">=16.0.0",
    npm: ">=7.0.0"
  };
  
  fs.writeFileSync(frontendPackagePath, JSON.stringify(frontendPackage, null, 2));
  console.log('✅ Frontend package.json updated');
}

// 3. Create Render build script for frontend
const renderBuildScript = `#!/bin/bash
# Build script for Render deployment
echo "Installing dependencies..."
npm install

echo "Building React app..."
npm run build

echo "Build completed successfully!"
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'render-build.sh'), renderBuildScript);
console.log('✅ Render build script created');

// 4. Create .env.example for backend
const envExample = `# MongoDB Connection - REQUIRED
# Get this from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cert-verify

# JWT Secret - REQUIRED 
# Generate a long, random, secure string (minimum 32 characters)
JWT_SECRET=your-super-secure-jwt-secret-key-here-32-characters-minimum

# JWT Token Expiration
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=production

# Server Port (Render will set this automatically)
PORT=5000

# Client Origin for CORS (your frontend URL)
CLIENT_ORIGIN=https://your-frontend-app.onrender.com
`;

fs.writeFileSync(path.join(__dirname, 'backend', '.env.example'), envExample);
console.log('✅ Environment example created');

console.log('\n🎉 Project setup completed!');
console.log('\n📝 Next Steps:');
console.log('1. Push your code to GitHub');
console.log('2. Set up MongoDB Atlas database');
console.log('3. Deploy backend on Render');
console.log('4. Deploy frontend on Render');
console.log('5. Update CORS and environment variables');
