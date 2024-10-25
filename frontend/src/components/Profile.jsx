import React from 'react';
import { Box, Container, Typography, Avatar, Grid2, Card, IconButton } from '@mui/material';
import { Email, Phone, CalendarToday, Edit } from '@mui/icons-material'; // Icons for email, phone, bookings, and edit

const ProfilePage = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, minHeight: '100vh' }}>
      <Container>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: 'white', color: 'black', position: 'relative' }}>
          
          {/* Edit Button in the Top Right Corner */}
          <IconButton 
            sx={{ position: 'absolute', top: 8, right: 8 }} 
            aria-label="edit"
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
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Prashant Kumar Singh {/* Placeholder name */}
                </Typography>
              </Grid2>
              
              {/* Information (Email, Phone, Bookings) */}
              <Grid2 item container spacing={2} alignItems="center">
                <Grid2 item sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1 }} />
                  officialprashanttt@gmail.com {/* Placeholder email */}
                </Grid2>
                <Grid2 item sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 1 }} />
                  +91 8009396321 {/* Placeholder phone number */}
                </Grid2>
                <Grid2 item sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ mr: 1 }} />
                  7 Hotels Booked {/* Placeholder bookings */}
                </Grid2>
              </Grid2>

            </Grid2>

          </Grid2>
        </Card>
      </Container>
    </Box>
  );
};

export default ProfilePage;
