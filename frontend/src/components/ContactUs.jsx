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

    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for the field when user starts typing
        setFormErrors(prev => ({ ...prev, [name]: false }));
    };

    const validateForm = () => {
        const errors = {};
        const { name, surname, phone, email, message } = formData;

        if (!name) errors.name = true;
        if (!surname) errors.surname = true;
        if (!phone) {
            errors.phone = true;
        } else {
            const phoneRegex = /^(\d{10}|\d{3}[-\s.]?\d{3}[-\s.]?\d{4})$/;
            if (!phoneRegex.test(phone)) errors.phone = true;
        }
        if (!email) {
            errors.email = true;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) errors.email = true;
        }
        if (!message) errors.message = true;

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            toast.error("Please fix the highlighted fields.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

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
            setFormErrors({});
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
                    error={formErrors.name}
                    helperText={formErrors.name && "First name is required"}
                    sx={{ mb: 2 }}
                />
                <TextField 
                    name="surname"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={formData.surname}
                    onChange={handleChange}
                    error={formErrors.surname}
                    helperText={formErrors.surname && "Last name is required"}
                    sx={{ mb: 2 }}
                />
                <TextField 
                    name="phone"
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange}
                    error={formErrors.phone}
                    helperText={formErrors.phone && "Enter a valid phone number"}
                    sx={{ mb: 2 }}
                />
                <TextField 
                    name="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    error={formErrors.email}
                    helperText={formErrors.email && "Enter a valid email address"}
                    sx={{ mb: 2 }}
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
                    error={formErrors.message}
                    helperText={formErrors.message && "Message is required"}
                    sx={{ mb: 2 }}
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
