/**
 * ProtectedRoute.jsx
 *
 * Wraps any route that requires authentication.
 * - If the user has a valid token  → renders the page normally.
 * - If no token is found           → redirects to /login,
 *   preserving the attempted URL in location.state so Login can
 *   send the user back after a successful sign-in.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../../services/api';

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    // Redirect to /login and remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
