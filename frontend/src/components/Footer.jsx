import React from 'react';
import { Box, Container, Grid, Typography, Button, TextField, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material'; // Importing social media icons

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* About Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography>
              We are a company focused on providing the best reTreats to help you relax and unwind. 
              Placeholder text for now.
            </Typography>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography>
              Email: info@retreat.com <br />
              Phone: +123-456-7890
            </Typography>

            {/* Social Media Icons */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <IconButton color="inherit" href="https://www.facebook.com" target="_blank" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" href="https://www.twitter.com" target="_blank" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" href="https://www.instagram.com" target="_blank" aria-label="Instagram">
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          {/* Sign Up Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Sign Up for Updates
            </Typography>
            <TextField
              label="Email Address"
              variant="filled"
              size="small"
              fullWidth
              InputProps={{
                style: { backgroundColor: 'white' },
              }}
            />
            <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} reTreat. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
