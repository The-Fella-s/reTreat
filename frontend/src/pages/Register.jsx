import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Container
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import reTreatLogo from "../assets/reTreatLogo.png";
import { GoogleLogin } from "@react-oauth/google";
import { default as jwt_decode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { loginWithToken } = useContext(AuthContext);

  const validatePassword = (password) => {
    const minLength = 8;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return password.length >= minLength && regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      toast.error(
        "Password must be 8+ chars, include uppercase, lowercase, number, special char."
      );
      return;
    }
    try {
      const response = await axios.post("/api/users/register", {
        email,
        password,
        name: `${firstName} ${lastName}`,
        phone
      });
      if (response.status === 201) {
        toast.success(
          "Registration successful! Check your email for a verification code."
        );
        localStorage.setItem("userId", response.data.user.id);
        setTimeout(() => {
          navigate("/verify-email");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  // "Register with Google" flow
  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);
    try {
      const res = await axios.post("/api/users/google-login", {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        sub: decoded.sub
      });
      loginWithToken(res.data.token);
      navigate("/profile");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        p={4}
        bgcolor="white"
        borderRadius={2}
        boxShadow={3}
        textAlign="center"
        sx={{ mt: 8 }}
      >
        <img
          src={reTreatLogo}
          alt="Logo"
          style={{ width: "100px", marginBottom: "1rem" }}
        />
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Join our community for reLaxation and reJuvenation!
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              sx={{ mr: 1 }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              sx={{ ml: 1 }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>
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
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            fullWidth
            margin="normal"
            required
            error={!validatePassword(password) && password.length > 0}
            helperText={
              !validatePassword(password) && password.length > 0
                ? "Password must be 8+ chars, include uppercase, lowercase, number, special char."
                : ""
            }
          />
          <TextField
            label="Phone Number"
            type="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>

        <Typography variant="body1" sx={{ my: 2 }}>
          OR
        </Typography>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google login failed")}
          text="signup_with"
        />

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1976d2", textDecoration: "none" }}>
            Sign On
          </Link>
        </Typography>
        <ToastContainer />
      </Box>
    </Container>
  );
};

export default Register;
