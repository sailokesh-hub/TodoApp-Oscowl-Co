import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const jwtToken = Cookies.get('jwtToken');
  
  if (!jwtToken) {
    // Redirect to login page if token is not found
    return <Navigate to="/login" />;
  }

  return children; // Render children if authenticated
};

export default ProtectedRoute;
