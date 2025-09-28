import React, { useState } from 'react';
import { register } from '../api/auth';
import './Auth.css';

const Register = ({ onSuccess, onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate role selection
    if (!formData.role) {
      setError('Please select your role');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await register(registrationData);
      console.log('Registration successful:', response);
      onSuccess(response.user);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">👤</div>
          <h2>Create Account</h2>
          <p>Join our secure verification platform</p>
        </div>

        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Select Your Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="role-select"
            >
              <option value="">Choose your role...</option>
              <option value="STUDENT">🎓 Student / Certificate Holder</option>
              <option value="EMPLOYER">🏢 Employer / Agency / University (Verifier)</option>
              <option value="INSTITUTION">🏛️ Institution / University Admin (Issuer)</option>
              <option value="GOV_ADMIN">🏛️ Government / Higher Education Department</option>
            </select>
            <small className="form-help">
              Choose the role that best describes your use of this platform
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Enter your password"
              minLength={6}
            />
            <small className="form-help">
              Password must be at least 6 characters long
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="auth-toggle"
              onClick={onToggleMode}
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
