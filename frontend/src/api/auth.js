// Auth API functions with automatic cookie handling
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE = `${API_BASE_URL}/api/auth`;

const fetchWithCredentials = async (url, options = {}) => {
  const config = {
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // Try to parse error response, but handle cases where it's not JSON
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If JSON parsing fails, use status text or generic message
        errorMessage = response.statusText || `HTTP ${response.status}: Request failed`;
      }
      throw new Error(errorMessage);
    }

    // Try to parse successful response as JSON
    const data = await response.json();
    return data;
    
  } catch (error) {
    // Handle network errors or JSON parsing errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your connection.');
    }
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      throw new Error('Server response error: Invalid JSON received. Please try again.');
    }
    // Re-throw other errors (including our custom ones)
    throw error;
  }
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
