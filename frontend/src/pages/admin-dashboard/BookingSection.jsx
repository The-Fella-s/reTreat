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
import axios from 'axios';

const BookingSection = () => {
  const [newBooking, setNewBooking] = useState({
    name: '', 
    category: '',
    description: '',
    pricing: '',
    duration: '',
    image: '',
  });

  const [bookings, setBookings] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Track which booking is being edited

  // Load bookings from the backend when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  // Save a new or updated booking to the backend
  const saveBookingToBackend = async (booking) => {
    try {
      const response = editIndex !== null
        ? await axios.put(`http://localhost:5000/api/appointments/${bookings[editIndex]._id}`, booking)
        : await axios.post('http://localhost:5000/api/appointments/populate', { appointments: [booking] }); // Use '/populate' here
  
      if (response.status === 200 || response.status === 201) {
        const updatedBookings = await axios.get('http://localhost:5000/api/appointments');
        setBookings(updatedBookings.data); // Update state with latest bookings
      }
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };
  
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  // Handle adding or updating a booking
  const handleSaveBooking = () => {
    console.log('Button clicked'); // Added for debugging
    
    if (
      newBooking.name &&
      newBooking.category &&
      newBooking.description &&
      newBooking.pricing &&
      newBooking.duration
    ) {
      console.log('Saving booking:', newBooking); // Log the booking data
  
      saveBookingToBackend(newBooking);
  
      // Reset form fields after saving
      setNewBooking({
        name: '',
        category: '',
        description: '',
        pricing: '',
        duration: '',
        image: '',
      });
  
      setEditIndex(null); // Reset edit index after saving
    } else {
      alert('*Please fill out required fields!');
    }
  };
  

  // Handle deleting a booking
  const handleDeleteBooking = async (index) => {
    // Ask for confirmation before deleting
    const confirmed = window.confirm('Are you sure you want to delete this booking?');
  
    if (confirmed) {
      try {
        const bookingToDelete = bookings[index];
        await axios.delete(`http://localhost:5000/api/appointments/${bookingToDelete._id}`);
        const updatedBookings = bookings.filter((_, i) => i !== index);
        setBookings(updatedBookings); // Update the state with the latest bookings
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    } else {
      console.log('Booking deletion canceled');
    }
  };
  

  // Handle editing a booking
  const handleEditBooking = (index) => {
    setNewBooking(bookings[index]); // Load existing booking data into form
    setEditIndex(index); // Set the edit index
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
          label="Name*"  
          name="name"    
          value={newBooking.name}  
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
          name="pricing"
          value={newBooking.pricing}
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
                  alt={booking.name}  
                />
              )}
              <CardContent>
                <Typography variant="h6">{booking.name}</Typography>  
                <Typography variant="body2" color="text.secondary">
                  {booking.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {booking.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {booking.pricing}
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
