import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reTreatLogo from '../assets/reTreatLogo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info("Logging you in..."); // Show the toast notification
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      sx={{ backgroundColor: '#f0f0f0' }}  // Box component's built-in styling (sx)
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
        {/* Logo */}
        <img src={reTreatLogo} alt="Logo" style={{ width: '100px', marginBottom: '1rem' }} />

        <Typography variant="h4" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Enter your credentials to access your account
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          {/* Password field */}
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          {/* Remember me checkbox */}
          <FormControlLabel
            control={<Checkbox name="remember" color="primary" />}
            label="Remember me"
          />

          {/* Submit button */}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ marginTop: 2 }}
          >
            Sign In
          </Button>

          {/* Footer links */}
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
      <ToastContainer /> {/* Add ToastContainer here */}
    </Box>
  );
}

export default Login;
