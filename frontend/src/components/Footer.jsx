import React from 'react';
import {Box, Container, Typography, Button, TextField, IconButton, Grid2} from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material'; // Importing social media icons

const Footer = () => {
  return (
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
        <Container>

          <Grid2 container>
            <Grid2
                container
                item
                size={4}
                justifyContent="center"
                alignItems="center"
                direction="column"
            >
              <Typography variant="h6" gutterBottom>
                About Us
              </Typography>
              <Typography>
                We are a company focused on providing the best reTreats to help you relax and unwind.
                Placeholder text for now.
              </Typography>
            </Grid2>
            <Grid2
                container
                item
                size={4}
                justifyContent="center"
                alignItems="center"
                direction="column">
              <Button variant="contained" color="secondary">
                Contact Us
              </Button>

              {/* Social Media Icons */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
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
            </Grid2>

            <Grid2
                container
                item
                size={4}
                justifyContent="center"
                alignItems="center"
                direction="column">
              <Typography variant="h6" gutterBottom>
                Sign Up for Updates
              </Typography>
              <TextField
                  label="Email Address"
                  variant="filled"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: 'white' }}
              />
              <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
                Sign Up
              </Button>
            </Grid2>

          </Grid2>

        </Container>
      </Box>
  );
};

export default Footer;
