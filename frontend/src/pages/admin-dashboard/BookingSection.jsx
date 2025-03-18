import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
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
  const [categories, setCategories] = useState([]); // Fetched categories

  // Load bookings from the backend when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories/list?source=mongo');
        const categoryNames = response.data.data.map(category => category.name);
        setCategories(categoryNames);
        // Optionally set a default category if none is set
        if (!newBooking.category && categoryNames.length > 0) {
          setNewBooking(prev => ({ ...prev, category: categoryNames[0] }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchBookings();
    fetchCategories();
  }, [newBooking.category]);

  // Save a new or updated booking to the backend
  const saveBookingToBackend = async (booking) => {
    try {
      let response;
      if (editIndex !== null) {
        // If we're updating an existing booking
        response = await axios.put(`http://localhost:5000/api/services/${bookings[editIndex]._id}`, booking);
      } else {
        // If we're adding a new booking
        response = await axios.post('http://localhost:5000/api/services/populate', { services: [booking] });
      }

      if (response.status === 200 || response.status === 201) {
        // Fetch updated bookings after saving
        const updatedBookings = await axios.get('http://localhost:5000/api/services');
        setBookings(updatedBookings.data); // Update state with the latest bookings
      }
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "duration") {
      // If value is in minutes, convert to hh:mm:ss format
      const minutes = parseInt(value, 10);
      if (!isNaN(minutes)) {
        const formattedDuration = `0:${String(minutes).padStart(2, "0")}:00`;
        setNewBooking({ ...newBooking, duration: formattedDuration });
        return;
      }
    }

    setNewBooking({ ...newBooking, [name]: value });
  };

  const [successMessage, setSuccessMessage] = useState(false);

  // Handle adding or updating a booking
  const handleSaveBooking = () => {
    const price = parseFloat(newBooking.pricing);

    if (
        !newBooking.name ||
        !newBooking.category ||
        !newBooking.description ||
        !newBooking.pricing ||
        !newBooking.duration
    ) {
      alert('*Please fill out required fields!');
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert('*Price must be a positive number!');
      return;
    }

    // Save the new or updated booking
    saveBookingToBackend(newBooking);

    // Success notification
    setSuccessMessage(true);

    // Reset form fields after saving
    setNewBooking({
      name: '',
      category: categories.length > 0 ? categories[0] : '',
      description: '',
      pricing: '',
      duration: '',
      image: '',
    });

    setEditIndex(null); // Reset edit index after saving
  };

  // Handle deleting a booking
  const [deleteMessage, setDeleteMessage] = useState(false);
  const handleDeleteBooking = async (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this booking?');
    if (confirmed) {
      try {
        const bookingToDelete = bookings[index];
        await axios.delete(`http://localhost:5000/api/services/${bookingToDelete._id}`);
        const updatedBookings = bookings.filter((_, i) => i !== index);
        setBookings(updatedBookings); // Update state with the latest bookings

        // Show success notification for deletion
        setDeleteMessage(true);
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  // Handle editing a booking
  const handleEditBooking = (index) => {
    setNewBooking(bookings[index]); // Load existing booking data into form
    setEditIndex(index); // Set the edit index

    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  };

  // State for tracking manual duration input
  const [isCustomDuration, setIsCustomDuration] = useState(false);

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
          <FormControl fullWidth>
            <InputLabel>Category*</InputLabel>
            <Select
                name="category"
                value={newBooking.category}
                onChange={handleInputChange}
            >
              {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              onChange={(e) => {
                let value = e.target.value;
                // Allow only numbers and a single decimal
                value = value.replace(/[^0-9.]/g, '');
                // Ensure only one decimal point
                if ((value.match(/\./g) || []).length > 1) return;
                // Limit to two decimal places
                if (value.includes('.')) {
                  const [dollars, cents] = value.split('.');
                  value = `${dollars}.${cents.substring(0, 2)}`;
                }
                setNewBooking({ ...newBooking, pricing: value });
              }}
              fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Duration*</InputLabel>
            <Select
                name="duration"
                value={isCustomDuration ? "custom" : newBooking.duration}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setIsCustomDuration(true);
                    setNewBooking({ ...newBooking, duration: "" }); // Reset duration when custom is selected
                  } else {
                    setIsCustomDuration(false);
                    setNewBooking({ ...newBooking, duration: e.target.value });
                  }
                }}
            >
              {["10", "15", "30", "45", "60", "90", "120"].map((option, index) => (
                  <MenuItem key={index} value={`0:${String(option).padStart(2, "0")}:00`}>
                    {option} minutes
                  </MenuItem>
              ))}
              <MenuItem value="custom">Other (Enter Manually)</MenuItem>
            </Select>
          </FormControl>
          {/* Show manual input only if "Other" is selected */}
          {isCustomDuration && (
              <TextField
                  label="Custom Duration (minutes)"
                  name="duration"
                  type="number"
                  value={newBooking.duration.replace("0:", "").replace(":00", "")} // Show only minutes in input
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value, 10);
                    if (!isNaN(minutes) && minutes >= 0) {
                      const formattedDuration = `0:${String(minutes).padStart(2, "0")}:00`;
                      setNewBooking({ ...newBooking, duration: formattedDuration });
                    }
                  }}
                  fullWidth
              />
          )}
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
                      Category: {booking.category?.name || booking.category}
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
