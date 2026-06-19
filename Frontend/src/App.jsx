import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LayoutWrapper from './components/Layout/LayoutWrapper';
import ProtectedRoute from './components/Common/ProtectedRoute';
import PublicRoute from './components/Common/PublicRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Tasks from './pages/Tasks';


import Settings from './pages/Settings';

function App() {
  return (
    <UserProvider>
      <Router>
      <Routes>

        {/* ── Public routes (redirect to / if already logged in) ── */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/register"
          element={<PublicRoute>
            <Register />
          </PublicRoute>} />

        {/* ── Protected routes (redirect to /login if not logged in) ── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LayoutWrapper title="Dashboard"><Dashboard /></LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <LayoutWrapper title="Projects"><Projects /></LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/create"
          element={
            <ProtectedRoute>
              <LayoutWrapper title="Create Project"><CreateProject /></LayoutWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <LayoutWrapper title="Tasks"><Tasks /></LayoutWrapper>
            </ProtectedRoute>
          }
        />
      
    
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <LayoutWrapper title="Settings"><Settings /></LayoutWrapper>
            </ProtectedRoute>
          }
        />

        {/* ── Catch-all: redirect unknown paths to home ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
