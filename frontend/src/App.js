import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/dashboards/StudentDashboard';
import EmployerDashboard from './components/dashboards/EmployerDashboard';
import InstitutionDashboard from './components/dashboards/InstitutionDashboard';
import GovAdminDashboard from './components/dashboards/GovAdminDashboard';
import { getCurrentUser, logout } from './api/auth';
import './components/Dashboard.css';

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Authentication functions
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on error
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
        setIsAuthenticated(true);
      } catch (error) {
        // User not authenticated, continue to login
        console.log('Not authenticated');
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user || !user.role) {
      return (
        <div className="App">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Loading user data...</p>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case 'STUDENT':
        return <StudentDashboard user={user} onLogout={handleLogout} />;
      case 'EMPLOYER':
        return <EmployerDashboard user={user} onLogout={handleLogout} />;
      case 'INSTITUTION':
        return <InstitutionDashboard user={user} onLogout={handleLogout} />;
      case 'GOV_ADMIN':
        return <GovAdminDashboard user={user} onLogout={handleLogout} />;
      default:
        return (
          <div className="App">
            <div className="error-container" style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Invalid user role</h2>
              <p>Please contact support for assistance.</p>
              <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', margin: '1rem' }}>Logout</button>
            </div>
          </div>
        );
    }
  };

  // Show loading screen while checking authentication
  if (isLoadingAuth) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication screens if not logged in
  if (!isAuthenticated) {
    return (
      <div className="App">
        {authMode === 'login' ? (
          <Login onSuccess={handleAuthSuccess} onToggleMode={toggleAuthMode} />
        ) : (
          <Register onSuccess={handleAuthSuccess} onToggleMode={toggleAuthMode} />
        )}
      </div>
    );
  }

  // Show main app if authenticated - render role-based dashboard
  return renderDashboard();
}

export default App;
