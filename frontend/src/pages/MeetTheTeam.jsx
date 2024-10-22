import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { Navigate } from 'react-router-dom';

function MeetTheTeam() {
  const teamMembers = [
    { name: 'Holly', title: 'Co-owner' },
    { name: 'Danniel', title: 'Co-owner' },
    { name: 'Angela', title: 'Manager' },
    { name: 'Lauren', title: 'Hair Stylist' }
  ];

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      sx={{ height: '100vh', backgroundColor: '#f5f5f5' }}
    >
      {/* Header Section */}
      <Typography variant="h3" gutterBottom>
        Meet the Team
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Meet our team of professionals to serve you
      </Typography>

      {/* Buttons */}
      <Box mb={4}>
        <Button 
          variant="contained" 
          sx={{ marginRight: 2, backgroundColor: '#333', color: '#fff' }}
        >
          About Us
        </Button>
        <Button 
          variant="outlined" 
          sx={{ borderColor: '#333', color: '#333' }}
          onClick={() => Navigate('/contact-us')}
        >
          Contact Us
        </Button>
      </Box>

      {/* Team Members */}
      <Grid container spacing={3} justifyContent="center">
        {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ textAlign: 'center' }}>
              <Card sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                {/* Image (Using a placeholder for now) */}
                <CardMedia
                    component="img"
                    height="200"
                    image="/path-to-team-member-image.jpg"
                    alt={member.name}
                />
                {/* Card Content */}
                <CardContent>
                  <Typography variant="h6" component="div">
                    {member.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
        ))}
      </Grid>

    </Box>
  );
}

export default MeetTheTeam;
