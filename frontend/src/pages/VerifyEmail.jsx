import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/verify-email', {
        userId,
        code,
      });
      toast.success(res.data.message);
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 4, bgcolor: 'white', mt: 8, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Verify Your Email
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please enter the verification code sent to your email.
        </Typography>
        <form onSubmit={handleVerify}>
          <TextField
            label="Verification Code"
            variant="outlined"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Verify Email
          </Button>
        </form>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default VerifyEmail;
