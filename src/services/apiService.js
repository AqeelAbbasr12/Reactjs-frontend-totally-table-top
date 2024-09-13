// src/services/apiService.js
import { refreshToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchWithAuth = async (url, options = {}) => {
  let authToken = localStorage.getItem('authToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers, // merge any additional headers
    },
  });

  if (response.status === 500) { // If unauthorized, try to refresh token
    try {
      const newAuthToken = await refreshToken(); // Attempt to refresh token
      // Retry the original request with the new token
      const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          'Authorization': `Bearer ${newAuthToken}`,
        },
      });
      return retryResponse; // Return the retried response
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Optionally, handle redirection to login page or logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/'; // Redirect to login
    }
  }

  return response;
};

export { fetchWithAuth };
