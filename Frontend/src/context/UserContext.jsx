import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount (if token exists)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('pf_token') || sessionStorage.getItem('pf_token');
        if (token) {
          const { user: userData } = await authService.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
