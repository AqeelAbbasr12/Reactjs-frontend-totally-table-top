import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if the user is authenticated

  console.log('Is Authenticated:', isAuthenticated); // Log the isAuthenticated value

  return !isAuthenticated ? <Navigate to="/user/convention" replace /> : element; // Redirect if authenticated
};

export default PublicRoute;
