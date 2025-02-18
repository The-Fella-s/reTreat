import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

const BookingSection = () => {
  const [newBooking, setNewBooking] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    duration: '',
    image: '',
  });

  const [bookings, setBookings] = useState([]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  // Handle adding a new booking
  const handleAddBooking = () => {
    if (
      newBooking.title &&
      newBooking.category &&
      newBooking.description &&
      newBooking.price &&
      newBooking.duration
    ) {
      setBookings((prevBookings) => [...prevBookings, newBooking]);
      setNewBooking({
        title: '',
        category: '',
        description: '',
        price: '',
        duration: '',
        image: '',
      }); // Reset form fields
    } else {
      alert('*Please fill out required fields!');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      {/* Form to Add New Booking */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: '400px',
          marginBottom: 4,
        }}
      >
        <TextField
          label="Title*"
          name="title"
          value={newBooking.title}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Category*"
          name="category"
          value={newBooking.category}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Description*"
          name="description"
          value={newBooking.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
        />
        <TextField
          label="Price*"
          name="price"
          value={newBooking.price}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Duration*"
          name="duration"
          value={newBooking.duration}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Image URL"
          name="image"
          value={newBooking.image}
          onChange={handleInputChange}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddBooking}>
          Add Booking
        </Button>
      </Box>

      {/* Existing Bookings */}
      <Typography variant="h5" gutterBottom>
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
                  alt={booking.title}
                />
              )}
              <CardContent>
                <Typography variant="h6">{booking.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {booking.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {booking.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {booking.duration}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookingSection;
