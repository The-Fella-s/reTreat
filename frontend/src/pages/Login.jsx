import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reTreatLogo from '../assets/reTreatLogo.png';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout } = useContext(AuthContext); // Access AuthContext methods
  const navigate = useNavigate();

  // Function to fetch user data using token
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched user data:", res.data);
      login(res.data); // Update context with fresh data
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
      logout(); // Clear invalid token and log out
    }
  };

  // Fetch user data on page load
  useEffect(() => {
    if (!user) {
      fetchUserData(); // Check if user is already logged in
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info('Logging you in...');
  
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
  
      if (res.data.token) {
        console.log("✅ Login Response:", res.data);
  
        localStorage.setItem('token', res.data.token); // Store token
        localStorage.setItem('user', JSON.stringify(res.data.user)); // Store user properly
        login({ user: res.data.user, token: res.data.token }); // Update context
  
        toast.success('Login successful!');
        navigate('/'); // Redirect to home
      } else {
        console.error("🚨 Login response missing token or user data.");
        toast.error("Invalid login response.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed.');
    }
  };
  

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: '#f0f0f0' }}
    >
      <Box
        p={4}
        bgcolor="white"
        borderRadius={2}
        boxShadow={3}
        maxWidth={400}
        width="100%"
        textAlign="center"
      >
        <img src={reTreatLogo} alt="Logo" style={{ width: '100px', marginBottom: '1rem' }} />
        <Typography variant="h4" gutterBottom>
          Welcome Back
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Sign In
          </Button>
        </form>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Login;
