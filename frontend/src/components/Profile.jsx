import React, { useState } from 'react'; // Import useState
import { Box, Container, Typography, Avatar, Grid2, Card, IconButton, TextField, Button } from '@mui/material';
import { Email, Phone, CalendarToday, Edit } from '@mui/icons-material'; // Icons for email, phone, bookings, and edit

const ProfilePage = () => {
  // State variables for profile data
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit mode
  const [name, setName] = useState('Name'); // Name state
  const [email, setEmail] = useState('email@gmail.com'); // Email state
  const [phone, setPhone] = useState('916-123-4567'); // Phone state
  const [bookings] = useState('x Appointments Booked'); // Bookings info is not editable for now

  // Handlers to toggle edit mode and update state
  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleCancel = () => setIsEditing(false); // Cancels the editing
  const handleSave = () => setIsEditing(false); // "Saves" changes and exits edit mode

  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, minHeight: '100vh' }}>
      <Container>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: 'white', color: 'black', position: 'relative' }}>
          
          {/* Edit Button in the Top Right Corner */}
          <IconButton 
            sx={{ position: 'absolute', top: 8, right: 8 }} 
            aria-label="edit"
            onClick={handleEditToggle}
          >
            <Edit />
          </IconButton>

          <Grid2 container spacing={2} alignItems="center">

            {/* Profile Picture Section */}
            <Grid2 item xs={12} sm={3} textAlign="center">
              <Avatar 
                alt="Profile Picture"
                src="/mnt/data/image.png" // Placeholder image path
                sx={{ width: 120, height: 120, borderRadius: 2 }} // Square shape with rounded corners
              />
            </Grid2>

            {/* Profile Information Section */}
            <Grid2 item xs={12} sm={9} container direction="column" spacing={1}>
              
              {/* Name */}
              <Grid2 item>
                {isEditing ? (
                  <TextField 
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {name}
                  </Typography>
                )}
              </Grid2>
              
              {/* Information (Email, Phone) */}
              <Grid2 item container spacing={2} alignItems="center">
                <Grid2 item sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1 }} />
                  {isEditing ? (
                    <TextField 
                      label="Email"
                      variant="outlined"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <Typography>{email}</Typography>
                  )}
                </Grid2>
                <Grid2 item sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 1 }} />
                  {isEditing ? (
                    <TextField 
                      label="Phone"
                      variant="outlined"
                      fullWidth
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  ) : (
                    <Typography>{phone}</Typography>
                  )}
                </Grid2>
                <Grid2 item sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ mr: 1 }} />
                  <Typography>{bookings}</Typography>
                </Grid2>
              </Grid2>

              {/* Save and Cancel Buttons */}
              {isEditing && (
                <Grid2 item container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                </Grid2>
              )}

            </Grid2>

          </Grid2>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
