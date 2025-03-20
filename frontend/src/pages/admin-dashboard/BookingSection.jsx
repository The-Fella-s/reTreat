import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid2 } from '@mui/material';
import axios from 'axios';
import AppointmentCardAdminEdit from '../../components/AppointmentCardAdminEdit.jsx';
import ComboBox from '../../components/BookingInputForm.jsx';
import {convertToTimeWords} from "../../utilities/conversion.js";

const BookingSection = () => {
    const [services, setServices] = useState({
        name: '',
        category: '',
        description: '',
        pricing: '',
        duration: '',
        servicePicture: '',
    });

    const getServiceImageUrl = useCallback((imagePath) => {
        if (!imagePath) return '';

        // If imagePath is not a string (e.g., it's a File), generate a temporary URL.
        if (typeof imagePath !== 'string') {
            return URL.createObjectURL(imagePath);
        }

        // If the imagePath is a blob or data URL (from file preview), return it directly.
        if (imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
            return imagePath;
        }

        // Return the localhost file
        return `http://localhost:5000${
            imagePath.startsWith('/uploads/services/')
                ? imagePath
                : `/uploads/services/${imagePath}`
        }`;
    }, []);

    const [categories, setCategories] = useState([]);
    const [serviceList, setServiceList] = useState([]);

    // Fetch categories only once on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(
                    'http://localhost:5000/api/categories/list?source=mongo'
                );
                const categoryNames = data.data.map(({ name }) => name);
                setCategories(categoryNames);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch services on mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/services');
                setServiceList(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    // Service callback to update the services
    const handleServiceChange = useCallback((field, value) => {
        setServices((prev) => ({ ...prev, [field]: value }));
    }, []);

    // Edit callback to update the input form with the selected service data
    const handleEditService = (serviceData) => {
        setServices({
            name: serviceData.title,
            category: serviceData.category,
            description: serviceData.description,
            pricing: serviceData.pricing,
            duration: serviceData.duration,
            servicePicture: serviceData.image,
        });
    };

    // Delete callback to remove the service from backend and update state
    const handleDeleteService = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/services/${id}`);
            // Remove the deleted service from the state
            setServiceList((prev) => prev.filter((service) => service._id !== id));
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    // Add service callback to add a new service via the populate endpoint.
    const onAddService = async () => {
        try {
            let imagePath = '';

            // Check if a file is selected and upload it first.
            if (services.servicePicture instanceof File) {
                const formData = new FormData();
                formData.append('servicePicture', services.servicePicture);
                const uploadResponse = await axios.post('http://localhost:5000/api/services/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                imagePath = uploadResponse.data.filePath;
            }

            // Prepare service data with the actual image path returned from the upload endpoint
            const serviceData = {
                name: services.name,
                category: services.category,
                description: services.description,
                pricing: services.pricing,
                duration: services.duration,
                servicePicture: imagePath,
            };

            await axios.post('http://localhost:5000/api/services/populate', {
                services: [serviceData],
            });

            const { data } = await axios.get('http://localhost:5000/api/services');
            setServiceList(data);
        } catch (error) {
            console.error('Error adding service:', error.response?.data || error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Service Management
            </Typography>

            <Grid2
                container
                spacing={2}
                justifyContent={{ xs: 'center', sm: 'left' }}
                alignItems={{ xs: 'center', sm: 'left' }}
                sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                }}
            >
                <ComboBox
                    image={getServiceImageUrl(services.servicePicture)}
                    name={services.name}
                    categories={categories}
                    category={services.category}
                    description={services.description}
                    duration={services.duration}
                    pricing={services.pricing}
                    onServiceChange={handleServiceChange}
                    onAddService={onAddService}
                />
                <AppointmentCardAdminEdit
                    image={getServiceImageUrl(services.servicePicture)}
                    title={services.name || 'No Title'}
                    category={services.category || 'No Category'}
                    description={services.description || 'No Description'}
                    duration={
                        // Check if duration is a number, if so, convert
                        // Otherwise use it or show 1 hour if default
                        typeof services.duration === 'number'
                            ? convertToTimeWords(services.duration)
                            : services.duration || '1 hour'
                    }
                    pricing={services.pricing || 0}
                />
            </Grid2>

            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                Existing Services
            </Typography>

            <Grid2 container spacing={2} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                {serviceList.map((service) => (
                    <Grid2 key={service._id} xs={12} sm={6} md={4}>
                        <AppointmentCardAdminEdit
                            image={getServiceImageUrl(service.servicePicture)}
                            title={service.name || 'No Title'}
                            category={service.category?.name || 'No Category'}
                            description={service.description || 'No Description'}
                            duration={
                                // Check if duration is a number, if so, convert
                                // Otherwise use it or show 1 hour if default
                                typeof services.duration === 'number'
                                    ? convertToTimeWords(services.duration)
                                    : services.duration || '1 hour'
                            }
                            pricing={service.pricing || 0}
                            onEdit={handleEditService} // Pass the edit callback
                            onDelete={() => handleDeleteService(service._id)} // Pass the delete callback
                        />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

export default BookingSection;
