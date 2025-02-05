import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reTreatLogo from '../assets/reTreatLogo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info("Logging you in...");

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password }, { withCredentials: true });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token); // Store JWT token
        localStorage.setItem('userRole', res.data.user.role); // Store user role
        toast.success('Login successful!');

        // Redirect based on role
        if (res.data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (res.data.user.role === 'employee') {
          navigate('/employee-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }
    } catch (error) {
      console.error(error);
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
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Login;
