import React, { useState } from "react";
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import reTreatLogo from "../assets/reTreatLogo.png";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();

    // Password validation function
    const validatePassword = (password) => {
        const minLength = 8;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; 
        return password.length >= minLength && regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password validation check
        if (!validatePassword(password)) {
            toast.error("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/users/register", {
                email,
                password,
                name: `${firstName} ${lastName}`,
                phone,
            });

            if (response.status === 201) {
                toast.success("Registration successful!");
                updateUniqueSignups();
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            const errorMessage = error.response?.data?.message || "Something went wrong!";
            toast.error(errorMessage);
        }
    };

    const updateUniqueSignups = async() => {
        try{
            await axios.post("http://localhost:5000/api/update-signups");
        } catch (error) {
            console.error("Error updating signup statistics:", error);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            sx={{ backgroundColor: "#f0f0f0" }}
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
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        fullWidth
                        margin="normal"
                        required
                        error={!validatePassword(password) && password.length > 0}
                        helperText={
                            !validatePassword(password) && password.length > 0
                                ? "Password must be 8+ chars, include an uppercase, lowercase, number, and special character."
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

                    <Box mt={2}>
                        <Typography variant="body2" color="textSecondary">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                style={{ color: "#1976d2", textDecoration: "none" }}
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </form>
                <ToastContainer />
            </Box>
        </Box>
    );
};

export default Register;
