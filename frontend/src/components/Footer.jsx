import React from 'react';
import { Box, Container, Typography, IconButton, Grid } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material'; // Importing social media icons

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
      <Container>
        <Grid container spacing={2} justifyContent="space-around">

          {/* Location Section */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              LOCATION
            </Typography>
            <Typography>
              198 Cirby Way Suite 135, <br />
              Roseville, CA, 95678
            </Typography>
          </Grid>

          {/* Connect With Us Section */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              CONNECT WITH US
            </Typography>
            <Box>
              <IconButton href="https://www.facebook.com" target="_blank" aria-label="Facebook" sx={{ color: 'white' }}>
                <Facebook />
              </IconButton>
            </Box>
            <Box>
              <IconButton href="https://www.instagram.com" target="_blank" aria-label="Instagram" sx={{ color: 'white' }}>
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          {/* Business Hours Section */}
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              BUSINESS HOURS
            </Typography>
            <Typography>
              Tuesday-Wednesday: 10 AM - 6 PM <br />
              Thursday: 10 AM - 7 PM <br />
              Friday & Saturday: 10 AM - 6 PM <br />
              Sunday: 11 AM - 5 PM
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
