import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);
    try {
      const res = await axios.post("http://localhost:5000/api/users/google-login", {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 4, bgcolor: 'white', mt: 8, borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
        </form>
        <Typography variant="body1" sx={{ my: 2 }}>OR</Typography>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google login failed")} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default Login;
