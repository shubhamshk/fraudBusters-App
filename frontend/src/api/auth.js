// Auth API functions with automatic cookie handling
const API_BASE = '/api/auth';

const fetchWithCredentials = async (url, options = {}) => {
  const config = {
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// Register new user
export const register = async (userData) => {
  return fetchWithCredentials(`${API_BASE}/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Login user
export const login = async (credentials) => {
  return fetchWithCredentials(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// Get current user (check if logged in)
export const getCurrentUser = async () => {
  return fetchWithCredentials(`${API_BASE}/me`);
};

// Logout user
export const logout = async () => {
  return fetchWithCredentials(`${API_BASE}/logout`, {
    method: 'POST',
  });
};

// Check if user is authenticated (utility function)
export const isAuthenticated = async () => {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
};
