import React, { useState } from 'react';
import { Box, Container, Typography, Avatar, Grid2, Card, IconButton, TextField, Button, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import { Email, Phone, CalendarToday, Edit } from '@mui/icons-material';

const ProfilePage = () => {
  // State variables for profile data
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Name');
  const [email, setEmail] = useState('email@gmail.com');
  const [phone, setPhone] = useState('+91 8009396321');
  const [appointments] = useState('7 Appointments Booked');

  // Dummy data for current and past spa appointments
  const currentAppointments = [
    { id: '173826', spa: 'Relaxing Spa', location: 'Roseville', date: 'Sun, 07 Jan at 07:00 PM', guests: '2 Guests', status: 'CONFIRMED' },
  ];
  const pastAppointments = [
    { id: '173825', spa: 'Healing Touch Spa', location: 'Roseville', date: 'Fri, 05 Jan at 05:00 PM', guests: '1 Guest', status: 'COMPLETED' },
    { id: '173824', spa: 'Serenity Spa', location: 'Roseville', date: 'Wed, 03 Jan at 03:00 PM', guests: '2 Guests', status: 'COMPLETED' },
  ];

  // Handlers to toggle edit mode and update state
  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleCancel = () => setIsEditing(false);
  const handleSave = () => setIsEditing(false);

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
                src="/mnt/data/image.png"
                sx={{ width: 120, height: 120, borderRadius: 2 }}
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
                  <Typography>{appointments}</Typography>
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

          {/* Appointments Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Current Appointments</Typography>
            {currentAppointments.length > 0 ? (
              <List>
                {currentAppointments.map((appointment) => (
                  <ListItem key={appointment.id}>
                    <ListItemAvatar>
                      <Avatar variant="square" src="spa_image_placeholder.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={appointment.spa}
                      secondary={
                        <>
                          <Typography>{appointment.location}</Typography>
                          <Typography>{appointment.date}</Typography>
                          <Typography>{appointment.guests}</Typography>
                          <Typography color="green">{appointment.status}</Typography>
                        </>
                      }
                    />
                    <Button href="#" variant="text">Check Details</Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No current appointments</Typography>
            )}
            
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Past Appointments</Typography>
            {pastAppointments.length > 0 ? (
              <List>
                {pastAppointments.map((appointment) => (
                  <ListItem key={appointment.id}>
                    <ListItemAvatar>
                      <Avatar variant="square" src="spa_image_placeholder.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={appointment.spa}
                      secondary={
                        <>
                          <Typography>{appointment.location}</Typography>
                          <Typography>{appointment.date}</Typography>
                          <Typography>{appointment.guests}</Typography>
                          <Typography color="textSecondary">{appointment.status}</Typography>
                        </>
                      }
                    />
                    <Button href="#" variant="text">Check Details</Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No past appointments</Typography>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
