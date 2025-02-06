import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reTreatLogo from '../assets/reTreatLogo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Store logged-in user data
  const navigate = useNavigate();

  // Function to fetch user data on page reload
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User data fetched:", res.data);
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user:', error.response?.data || error.message);
      localStorage.removeItem('token'); // Clear invalid token
    }
  };

  useEffect(() => {
    fetchUserData(); // Run on page load
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info("Logging you in...");

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', 
        { email, password },
        { headers: { "Content-Type": "application/json" } } // Removed withCredentials
      );

      console.log("Login response:", res.data);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token); // Store JWT token
        localStorage.setItem('user', JSON.stringify(res.data.user)); // Store full user data
        setUser(res.data.user); // Set user state
        toast.success('Login successful!');

        // Redirect based on role
        navigate(res.data.user.role === 'admin' ? '/admin-dashboard' : 
                 res.data.user.role === 'employee' ? '/employee-dashboard' : 
                 '/user-dashboard');
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    toast.info('Logged out successfully.');
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

        {user ? (
          <>
            <Typography variant="h4">Welcome, {user.name}!</Typography>
            <Typography variant="body1">Role: {user.role}</Typography>
            <Typography variant="body2">{user.email}</Typography>
            <Button 
              onClick={handleLogout} 
              variant="contained" 
              color="secondary" 
              fullWidth 
              sx={{ marginTop: 2 }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Enter your credentials to access your account
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

              <FormControlLabel
                control={<Checkbox name="remember" color="primary" />}
                label="Remember me"
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

              <Box mt={2}>
                <Typography variant="body2">
                  <a href="#" style={{ color: '#1976d2', textDecoration: 'none' }}>Forgot password?</a>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Don’t have an account? <a href="#" style={{ color: '#1976d2', textDecoration: 'none' }}>Create one</a>
                </Typography>
              </Box>
            </form>
          </>
        )}
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Login;
