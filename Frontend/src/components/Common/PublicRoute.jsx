/**
 * PublicRoute.jsx
 *
 * Wraps routes that are only for unauthenticated users (e.g. /login, /register).
 * - If the user is NOT logged in → renders the page.
 * - If the user IS logged in     → redirects to Dashboard (or wherever they came from).
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../../services/api';

const PublicRoute = ({ children }) => {
  const token = getToken();
  const location = useLocation();

  if (token) {
    // Already logged in — send them to their intended page or home
    const destination = location.state?.from?.pathname || '/';
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default PublicRoute;
