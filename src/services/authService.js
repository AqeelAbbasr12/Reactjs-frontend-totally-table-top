// src/services/authService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refreshToken'); // store refreshToken in localStorage
  if (!refresh_token) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  localStorage.setItem('authToken', data.access_token); // Update auth token in localStorage
  return data.access_token;
};

export { refreshToken };
