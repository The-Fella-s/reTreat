import React from 'react';
import { Box, TextField, Typography, Button } from '@mui/material'; 

const Contact = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Contact Us</h1>

            <Box 
                sx={{ 
                    width: '50%', 
                    margin: '0 auto', 
                    padding: '20px', 
                    border: '1px solid lightgray', 
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Please Fill in Your Details:
                </Typography>
                <TextField 
                    label="Name" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ marginBottom: 2 }}
                ></TextField>
                <TextField 
                    label="Surname" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ marginBottom: 2 }}
                ></TextField>
                <TextField 
                    label="Phone Number" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ marginBottom: 2 }}
                ></TextField>
                <TextField 
                    label="Email"
                    type="email" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ marginBottom: 2 }}
                ></TextField>
                <TextField 
                    label="Message" 
                    variant="outlined" 
                    fullWidth 
                    multiline 
                    rows={6}
                    sx={{ marginBottom: 2 }}
                ></TextField>
                <Button 
                variant="contained" 
                color="secondary"
                fullWidth>
                Submit
                </Button>
            </Box>
        </div>
    );
};

export default Contact;
