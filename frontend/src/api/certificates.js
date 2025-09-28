// Certificates API functions with automatic cookie handling
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE = `${API_BASE_URL}/api/certificates`;

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

// Upload certificate for verification
export const uploadCertificate = async (formData) => {
  return fetchWithCredentials(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData, // Don't set Content-Type for FormData, let browser handle it
    headers: {}, // Override default JSON headers for file upload
  });
};

// Get verification history
export const getVerificationHistory = async () => {
  return fetchWithCredentials(`${API_BASE}/history`);
};

// Get specific certificate verification
export const getCertificateVerification = async (certId) => {
  return fetchWithCredentials(`${API_BASE}/${certId}`);
};

// Issue a new certificate (Institution role)
export const issueCertificate = async (certificateData) => {
  return fetchWithCredentials(`${API_BASE}/issue`, {
    method: 'POST',
    body: JSON.stringify(certificateData),
  });
};

// Get issued certificates (Institution role)
export const getIssuedCertificates = async () => {
  return fetchWithCredentials(`${API_BASE}/issued`);
};

// Revoke certificate (Institution role)
export const revokeCertificate = async (certId) => {
  return fetchWithCredentials(`${API_BASE}/${certId}/revoke`, {
    method: 'POST',
  });
};

// Bulk verification (Employer role)
export const bulkVerifyCertificates = async (formData) => {
  return fetchWithCredentials(`${API_BASE}/bulk-verify`, {
    method: 'POST',
    body: formData,
    headers: {},
  });
};

// Get blacklist (Government role)
export const getBlacklist = async () => {
  return fetchWithCredentials(`${API_BASE}/blacklist`);
};

// Add to blacklist (Government role)
export const addToBlacklist = async (entityData) => {
  return fetchWithCredentials(`${API_BASE}/blacklist`, {
    method: 'POST',
    body: JSON.stringify(entityData),
  });
};

// Remove from blacklist (Government role)
export const removeFromBlacklist = async (entityId) => {
  return fetchWithCredentials(`${API_BASE}/blacklist/${entityId}`, {
    method: 'DELETE',
  });
};
