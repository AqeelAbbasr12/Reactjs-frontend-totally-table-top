import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if the user is authenticated

  console.log('Is Authenticated:', isAuthenticated); // Log the isAuthenticated value

  return isAuthenticated ? element : <Navigate to="/" replace />; // Redirect to login if not authenticated
};

export default ProtectedRoute;
