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
import {Link} from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reTreatLogo from '../assets/reTreatLogo.png';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Phone:', phone);

        toast.success("Registration complete!");
    }

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
                {/* Logo */}

                <img src={reTreatLogo} alt="Logo" style={{ width: '100px', marginBottom: '1rem' }} />

                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                    Join our community for relaxation and rejuvenation
                </Typography>

                <form onSubmit={handleSubmit}>
                    {/* Name fields */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            sx={{ mr: 1 }} // Margin between fields
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            sx={{ ml: 1 }} // Margin between fields
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Box>

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
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        fullWidth
                        margin="normal"
                        required
                    />

                    {/* Phone Number field */}
                    <TextField
                        label="Phone Number"
                        type="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />

                    {/* Submit button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>

                    {/* Footer links */}
                    <Box mt={2}>
                        <Typography variant="body2" color="textSecondary">
                            Already have an account? <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>Sign in</Link>
                        </Typography>
                    </Box>
                </form>

                {/* Toast container to display the notification */}
                <ToastContainer />
            </Box>
        </Box>
    );
};

export default Register;