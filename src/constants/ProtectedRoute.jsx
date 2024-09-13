import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if the user is authenticated

  // If the user is not authenticated, redirect to the login page
  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
