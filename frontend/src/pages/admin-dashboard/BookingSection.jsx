import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
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
  const [editIndex, setEditIndex] = useState(null); // Track which booking is being edited

  // Load bookings from localStorage when component mounts
  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  // Save bookings to localStorage
  const saveBookings = (updatedBookings) => {
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  // Handle adding or updating a booking
  const handleSaveBooking = () => {
    if (
      newBooking.title &&
      newBooking.category &&
      newBooking.description &&
      newBooking.price &&
      newBooking.duration
    ) {
      if (editIndex !== null) {
        // Update existing booking
        const updatedBookings = [...bookings];
        updatedBookings[editIndex] = newBooking;
        saveBookings(updatedBookings);
        setEditIndex(null);
      } else {
        // Add new booking
        const updatedBookings = [...bookings, newBooking];
        saveBookings(updatedBookings);
      }

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

  // Handle deleting a booking
  const handleDeleteBooking = (index) => {
    const updatedBookings = bookings.filter((_, i) => i !== index);
    saveBookings(updatedBookings);
  };

  // Handle editing a booking
  const handleEditBooking = (index) => {
    setNewBooking(bookings[index]); // Load existing booking data into form
    setEditIndex(index);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>

      {/* Form to Add or Edit Booking */}
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
        <Button variant="contained" onClick={handleSaveBooking}>
          {editIndex !== null ? 'Update Booking' : 'Add Booking'}
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
  );
};

export default BookingSection;
