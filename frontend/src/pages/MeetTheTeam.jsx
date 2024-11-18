import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { Navigate } from 'react-router-dom';

function MeetTheTeam() {
  const teamMembers = [
    { name: 'Holly', title: 'Co-owner', image: 'src/assets/team_photos/holly.webp'},
    { name: 'Danniel', title: 'Co-owner', image: 'src/assets/team_photos/danniel.webp'},
    { name: 'Angela', title: 'Manager', image: 'src/assets/team_photos/angela.webp'},
    { name: 'Lauren', title: 'Hair Stylist', image: 'src/assets/team_photos/lauren.webp'},
    { name: 'Melissa', title: 'Hair Stylist', image: 'src/assets/team_photos/melissa.webp'},
    { name: 'Evgenia', title: 'Esthetician', image: 'src/assets/team_photos/evgenia.webp'},
    { name: 'Vy', title: 'Nail Technician', image: 'src/assets/team_photos/vy.webp'},
    { name: 'Yella', title: 'Esthetician', image: 'src/assets/team_photos/yella.webp'},
    { name: 'Franny', title: 'Receptionist', image: 'src/assets/team_photos/franny.webp'},
    { name: 'Megan', title: 'Esthetician', image: 'src/assets/team_photos/megan.webp'},
    { name: 'Ashlyn', title: 'Receptionist', image: 'src/assets/team_photos/ashlyn.webp'},
    { name: 'Sofiya', title: 'Esthetician & Receptionist', image: 'src/assets/team_photos/sofiya.webp'},
    { name: 'Irina', title: 'Massage Therapist', image: 'src/assets/team_photos/irina.webp'}

  ];

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingTop: 4, paddingBottom: 4 }}
    >
      {/* Header Section */}
      <Typography variant="h3" gutterBottom sx = {{fontFamily: "Special Elite"}}>
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
                    height="300"
                    image={member.image}
                    alt={member.name}
                    sx={{ objectFit: 'contain'}}
                />
                {/* Card Content */}
                <CardContent>
                  <Typography variant="h6" component="div">
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {member.title}
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
