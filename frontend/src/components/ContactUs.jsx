import React, { useState } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/send-email', formData);
            toast.success("Form successfully sent!");
            setFormData({
                name: '',
                surname: '',
                phone: '',
                email: '',
                message: ''
            });
        } catch (error) {
            toast.error("Failed to send message.");
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: "Special Elite" }}>
            <h1>Contact Us</h1>

            <Box 
                component="form"
                onSubmit={handleSubmit}
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
                    name="name"
                    label="First Name" 
                    variant="outlined" 
                    fullWidth 
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ marginBottom: 2 }}
                />
                <TextField 
                    name="surname"
                    label="Last Name" 
                    variant="outlined" 
                    fullWidth 
                    value={formData.surname}
                    onChange={handleChange}
                    sx={{ marginBottom: 2 }}
                />
                <TextField 
                    name="phone"
                    label="Phone Number" 
                    variant="outlined" 
                    fullWidth 
                    value={formData.phone}
                    onChange={handleChange}
                    sx={{ marginBottom: 2 }}
                />
                <TextField 
                    name="email"
                    label="Email"
                    type="email" 
                    variant="outlined" 
                    fullWidth 
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ marginBottom: 2 }}
                />
                <TextField 
                    name="message"
                    label="Message" 
                    variant="outlined" 
                    fullWidth 
                    multiline 
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    sx={{ marginBottom: 2 }}
                />
                <Button 
                    type="submit"
                    variant="contained" 
                    color="secondary"
                    fullWidth
                >
                    Submit
                </Button>
            </Box>
            <ToastContainer />
        </div>
    );
};

export default Contact;
