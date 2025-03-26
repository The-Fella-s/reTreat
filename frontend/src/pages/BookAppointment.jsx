import React, { useState, useEffect } from 'react';
import { Grid2, Typography, Button, Box } from '@mui/material';
import AppointmentCard from '../components/AppointmentCard.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getServiceImageUrl } from "../utilities/image.js";
import { convertToTimeWords } from "../utilities/formatDuration.js";

const BookAppointment = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('Body Treatments');
    const [appointments, setAppointments] = useState([]);
    const [categories, setCategories] = useState([]);

    // Function to fetch services from backend
    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/services');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    // Function to fetch categories from backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories/list?source=mongo');

            // Extract category names from the data
            const categoryNames = response.data.data.map(category => category.name);
            setCategories(categoryNames);

            // Optionally, update the selectedCategory if the current one isn't in the new list
            if (!categoryNames.includes(selectedCategory)) {
                setSelectedCategory(categoryNames[0]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Auto-fetch services and categories on mount
    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, []);

    const handleAppointmentBookConfirm = (appointmentData) => {
        navigate('/payment', { state: { appointmentData } });
    };

    return (
        <Grid2 style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid2>
                <Typography
                    variant="h3"
                    gutterBottom
                    align="center"
                    sx={{ fontWeight: 'bold', fontFamily: "Special Elite" }}
                    xs={12} sm={6} md={4} p={5}
                >
                    Book Appointment
                </Typography>

                <Grid2 container spacing={2} justifyContent="center" alignItems="center">
                    {categories.map((category, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            style={{
                                padding: "10px",
                                textAlign: "center",
                                backgroundColor: selectedCategory === category ? "#1976d2" : "",
                                color: selectedCategory === category ? "white" : "",
                                whiteSpace: "nowrap",
                            }}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </Grid2>

                <Box p={5}>
                    <Grid2
                        container
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                        direction={{ xs: "column", sm: "row" }}
                    >
                        {appointments
                            .filter(service => (service.category?.name || service.category) === selectedCategory)
                            .map((service, index) => (
                                <Grid2 item xs={12} sm={6} md={4} sx={{ p: 1.5 }} key={index}>
                                    <AppointmentCard
                                        title={service.name}
                                        description={service.description}
                                        pricing={service.pricing}
                                        duration={convertToTimeWords(service.duration)}

                                        // Pass the image by converting the servicePicture to a URL if available
                                        image={getServiceImageUrl(service.servicePicture)}

                                        onAppointmentBookConfirm={() => handleAppointmentBookConfirm(service)}
                                    />
                                </Grid2>
                            ))}
                    </Grid2>
                </Box>

            </Grid2>
        </Grid2>
    );
};

export default BookAppointment;
