import React from 'react';
import { Box, Container, Typography, IconButton, Grid2 } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
      <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 4 }}>
        <Container>
          <Grid2
              container
              spacing={4}
              justifyContent={{ xs: 'center', md: 'space-between' }}
              alignItems="center"
              direction={{ xs: 'column', md: 'row' }}
          >
            <Grid2 item xs={12} md={12}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}> {/* Centered text */}
                LOCATION
              </Typography>
              <Typography align="center">
                198 Cirby Way Suite 135, <br />
                Roseville, CA, 95678
              </Typography>
            </Grid2>

            <Grid2 item xs={12} md={12}>
              <Typography variant="h5" gutterBottom>
                CONNECT WITH US
              </Typography>
              <Box display="flex" justifyContent="center" gap={2}>
                <IconButton color="inherit" href="https://www.facebook.com" target="_blank" aria-label="Facebook">
                  <Facebook />
                </IconButton>
                <IconButton color="inherit" href="https://www.instagram.com" target="_blank" aria-label="Instagram">
                  <Instagram />
                </IconButton>
              </Box>
            </Grid2>

            <Grid2 item xs={12} md={12}>
              <Typography variant="h5" gutterBottom>
                BUSINESS HOURS
              </Typography>
              <Grid2 container justifyContent="center">
                <Grid2 item xs={12} sm={6}>
                  <Typography align="left">
                    Monday: <br />
                    Tuesday: <br />
                    Wednesday: <br />
                    Thursday: <br />
                    Friday: <br />
                    Saturday: <br />
                    Sunday:
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography align="right">
                    Closed <br />
                    10 AM - 6 PM <br />
                    10 AM - 6 PM <br />
                    10 AM - 7 PM <br />
                    10 AM - 6 PM <br />
                    10 AM - 6 PM <br />
                    11 AM - 5 PM
                  </Typography>
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
  );
};

export default Footer;
