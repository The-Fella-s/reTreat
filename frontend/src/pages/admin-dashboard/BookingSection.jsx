import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import AppointmentCardAdminEdit from '../../components/AppointmentCardAdminEdit.jsx';
import ComboBox from '../../components/BookingInputForm.jsx';
import { getServiceImageUrl } from '../../utilities/image.js';
import { convertToTimeWords } from '../../utilities/formatDuration.js';

const BookingSection = () => {
  const [services, setServices] = useState({
    name: '',
    category: '',
    description: '',
    pricing: '',
    duration: '',
    servicePicture: '',
  });

  const [categories, setCategories] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);

  // Fetch categories
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

  // Fetch services
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

  const handleServiceChange = useCallback((field, value) => {
    setServices((prev) => ({ ...prev, [field]: value }));
  }, []);

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

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      setServiceList((prev) => prev.filter((service) => service._id !== id));
      setDeleteMessage(true);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const onAddService = async () => {
    try {
      let imagePath = '';

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
      setSuccessMessage(true);
    } catch (error) {
      console.error('Error adding service:', error.response?.data || error);
    }
  };

  const handleEditBooking = (index) => {
    const booking = bookings[index];
    setServices({
      name: booking.name,
      category: booking.category,
      description: booking.description,
      pricing: booking.pricing,
      duration: booking.duration,
      servicePicture: booking.image,
    });
  };

  const handleDeleteBooking = (index) => {
    const updated = [...bookings];
    updated.splice(index, 1);
    setBookings(updated);
    setDeleteMessage(true);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Service Management
        </Typography>

        <Grid2
          container
          spacing={2}
          justifyContent={{ xs: 'center', sm: 'left' }}
          alignItems={{ xs: 'center', sm: 'left' }}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
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
                  typeof services.duration === 'number'
                    ? convertToTimeWords(services.duration)
                    : services.duration || '1 hour'
                }
                pricing={service.pricing || 0}
                onEdit={handleEditService}
                onDelete={() => handleDeleteService(service._id)}
              />
            </Grid2>
          ))}
        </Grid2>

        <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>
          Existing Bookings
        </Typography>

        <Grid container spacing={3}>
          {bookings.map((booking, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                {booking.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={booking.image}
                    alt={booking.name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{booking.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {booking.category?.name || booking.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: {booking.pricing}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {convertToTimeWords(booking.duration)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleEditBooking(index)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDeleteBooking(index)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage(false)} severity="success">
          Booking successfully added!
        </Alert>
      </Snackbar>

      <Snackbar
        open={deleteMessage}
        autoHideDuration={3000}
        onClose={() => setDeleteMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setDeleteMessage(false)} severity="error">
          Booking successfully deleted!
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingSection;
