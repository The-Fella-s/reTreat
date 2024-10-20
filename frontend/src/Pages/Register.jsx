import React, {useState} from "react";
import {Box, Button, Grid2, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import reactLogo from "../assets/react.svg";

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
    }

    return (
        <Grid2 container direction="column" alignItems="center" spacing={4}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 750,
                    maxHeight: 700,
                    borderRadius: 1,
                    bgcolor: '#d9d9d9',
                    p: 2
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 750,
                        maxHeight: 700,
                        borderRadius: 1,
                        bgcolor: '#ffffff',
                    }}
                >
                    <Grid2 container
                           spacing={2.5}
                           direction="column"
                           alignItems="center"
                           justifyContent="center"
                           sx={{minHeight: '75vh'}}
                    >
                        { /* Logo */ }
                        <Box
                            component="img"
                            sx={{
                                height: 80,
                                width: 64,
                                maxHeight: { xs: 80, md: 64 },
                                maxWidth: { xs: 80, md: 64 },
                            }}
                            alt="logo."
                            src={reactLogo}
                        />

                        <Typography variant="h4" gutterbottom sx={{ fontWeight: 'bold' }}>Register</Typography>
                        <Typography variant="h6" gutterbottom>Join our community for relaxation and rejuvenation</Typography>
                        <Grid2 container size={8}>
                            <TextField
                                id="outlined-basic"
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                sx={{minWidth: 100, width: '50%', flex: 1}}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                sx={{minWidth: 100, width: '50%'}}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                sx={{minWidth: 100}}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Password"
                                variant="outlined"
                                fullWidth
                                sx={{minWidth: 100}}
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword((prev) => !prev)}  // Correctly toggle the state
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Phone Number"
                                variant="outlined"
                                fullWidth
                                sx={{minWidth: 100}}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit}
                            >
                                Register
                            </Button>
                            <Grid2 container size={16}
                                   direction="column"
                                   alignItems="center"
                                   justifyContent="center"
                            >
                                <Typography>
                                    Already have an account?
                                    <Button
                                        variant="text"
                                        component={Link}
                                        to="/login"
                                        sx={{
                                            '&.MuiButton-root:hover': {bgcolor: 'transparent'},
                                            textTransform: "none"
                                        }}
                                    >
                                        Sign in
                                    </Button>
                                </Typography>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Box>
            </Box>
        </Grid2>
    );

};

export default Register;