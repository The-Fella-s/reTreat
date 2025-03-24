import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Provide a method to set the token & load user
  const loginWithToken = (token) => {
    localStorage.setItem('token', token);
    fetchUserProfile(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
