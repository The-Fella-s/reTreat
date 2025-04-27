// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // On mount: try to auto-login using token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  // Fetch user from backend using token
  const fetchUserProfile = async (token) => {
    try {
      const res = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('❌ Error fetching user profile:', err);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Login when you get token and user from backend (e.g., Google or login response)
  const login = ({ token, user }) => {
    if (!token || !user) {
      console.error("❌ Missing token or user data during login.");
      return;
    }
    localStorage.setItem('token', token);
    setUser(user);
    navigate('/profile'); // Redirect to profile or homepage
  };

  // Login if only token is provided (e.g., Google login or existing token)
  const loginWithToken = (token) => {
    localStorage.setItem('token', token);
    fetchUserProfile(token);
  };

  // Logout and clear data
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
