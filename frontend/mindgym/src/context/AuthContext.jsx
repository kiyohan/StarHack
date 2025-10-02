import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a token in localStorage on initial load
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/user');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Failed to load user', err);
      logout(); // Token might be invalid, so log out
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    const body = { username, email, password };
    const res = await api.post('/auth/register', body);
    localStorage.setItem('token', res.data.token);
    await loadUser();
  };

  const login = async (email, password) => {
    const body = { email, password };
    const res = await api.post('/auth/login', body);
    localStorage.setItem('token', res.data.token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // This function will be called from the dashboard to update points/streak
  const updateUserState = (newUserData) => {
    setUser(newUserData);
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateUserState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};