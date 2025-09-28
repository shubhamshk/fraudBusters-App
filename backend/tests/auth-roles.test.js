const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

// Mock test setup
describe('Role-based Authentication & Authorization', () => {
  let studentUser, employerUser, institutionUser, govAdminUser;
  let studentToken, employerToken, institutionToken, govAdminToken;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cert-verify-test');
    
    // Clear existing test users
    await User.deleteMany({ email: /test\.com$/ });
    
    // Create test users for each role
    studentUser = await User.create({
      name: 'Test Student',
      email: 'student-test@test.com',
      password: 'password123',
      role: 'STUDENT'
    });

    employerUser = await User.create({
      name: 'Test Employer',
      email: 'employer-test@test.com',
      password: 'password123',
      role: 'EMPLOYER'
    });

    institutionUser = await User.create({
      name: 'Test Institution',
      email: 'institution-test@test.com',
      password: 'password123',
      role: 'INSTITUTION'
    });

    govAdminUser = await User.create({
      name: 'Test Gov Admin',
      email: 'govadmin-test@test.com',
      password: 'password123',
      role: 'GOV_ADMIN'
    });
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteMany({ email: /test\.com$/ });
    await mongoose.connection.close();
  });

  describe('User Registration with Roles', () => {
    test('should register a student with valid role', async () => {
      const userData = {
        name: 'New Student',
        email: 'newstudent@test.com',
        password: 'password123',
        role: 'STUDENT',
        profile: {
          rollNo: 'ST2024002',
          institution: 'Test University'
        }
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe('STUDENT');
      expect(response.body.user.profile.rollNo).toBe('ST2024002');
    });

    test('should reject registration without role', async () => {
      const userData = {
        name: 'Invalid User',
        email: 'invalid@test.com',
        password: 'password123'
        // Missing role
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('role');
    });

    test('should reject registration with invalid role', async () => {
      const userData = {
        name: 'Invalid Role User',
        email: 'invalidrole@test.com',
        password: 'password123',
        role: 'INVALID_ROLE'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid role');
    });
  });

  describe('Role-based Authorization', () => {
    beforeAll(async () => {
      // Login and get tokens for each user
      const studentLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'student-test@test.com', password: 'password123' });
      studentToken = studentLogin.headers['set-cookie'];

      const employerLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'employer-test@test.com', password: 'password123' });
      employerToken = employerLogin.headers['set-cookie'];

      const institutionLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'institution-test@test.com', password: 'password123' });
      institutionToken = institutionLogin.headers['set-cookie'];

      const govAdminLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'govadmin-test@test.com', password: 'password123' });
      govAdminToken = govAdminLogin.headers['set-cookie'];
    });

    test('student should access certificate verification', async () => {
      const response = await request(app)
        .post('/api/certificates/verify')
        .set('Cookie', studentToken)
        .send({ certificateFile: 'mock-file' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('employer should access certificate verification', async () => {
      const response = await request(app)
        .post('/api/certificates/verify')
        .set('Cookie', employerToken)
        .send({ certificateFile: 'mock-file' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('employer should access bulk verification', async () => {
      const response = await request(app)
        .post('/api/certificates/bulk-verify')
        .set('Cookie', employerToken)
        .send({ certificates: ['file1', 'file2'] })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('student should NOT access bulk verification', async () => {
      const response = await request(app)
        .post('/api/certificates/bulk-verify')
        .set('Cookie', studentToken)
        .send({ certificates: ['file1', 'file2'] })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });

    test('institution should access certificate issuance', async () => {
      const response = await request(app)
        .post('/api/certificates/issue')
        .set('Cookie', institutionToken)
        .send({
          studentName: 'Test Student',
          certificateType: 'Degree',
          studentId: 'ST001'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('student should NOT access certificate issuance', async () => {
      const response = await request(app)
        .post('/api/certificates/issue')
        .set('Cookie', studentToken)
        .send({
          studentName: 'Test Student',
          certificateType: 'Degree',
          studentId: 'ST001'
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('government admin should access analytics', async () => {
      const response = await request(app)
        .get('/api/certificates/analytics')
        .set('Cookie', govAdminToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.analytics).toBeDefined();
    });

    test('institution should NOT access analytics', async () => {
      const response = await request(app)
        .get('/api/certificates/analytics')
        .set('Cookie', institutionToken)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test('government admin should access blacklist management', async () => {
      const response = await request(app)
        .post('/api/certificates/blacklist')
        .set('Cookie', govAdminToken)
        .send({
          name: 'Fake Institution',
          type: 'Institution',
          reason: 'Fraudulent certificates'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('all authenticated users should access their history', async () => {
      const studentResponse = await request(app)
        .get('/api/certificates/user-history')
        .set('Cookie', studentToken)
        .expect(200);

      const employerResponse = await request(app)
        .get('/api/certificates/user-history')
        .set('Cookie', employerToken)
        .expect(200);

      expect(studentResponse.body.success).toBe(true);
      expect(employerResponse.body.success).toBe(true);
    });

    test('unauthenticated users should be denied access', async () => {
      const response = await request(app)
        .post('/api/certificates/verify')
        .send({ certificateFile: 'mock-file' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

// Export app for testing
module.exports = app;
