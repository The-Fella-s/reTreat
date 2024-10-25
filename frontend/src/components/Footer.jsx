import React from 'react';
import { Box, Container, Typography, IconButton, Grid2 } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
        <Container>
          <Grid2
              container
              spacing={4} // Adds spacing between grid items
              justifyContent={{ xs: 'center', md: 'space-between' }} // Centered on mobile, spaced on desktop
              alignItems="center"
              direction={{ xs: 'column', md: 'row' }} // Column on mobile, row on desktop
          >
            {/* Location Section */}
            <Grid2
                item
                xs={12} sm={6} md={4} // Full width on mobile, split on desktop
                display="flex"
                flexDirection="column"
                alignItems={{ xs: 'center', md: 'flex-start' }} // Centered on mobile, aligned left on desktop
            >
              <Typography variant="h5" gutterBottom>
                LOCATION
              </Typography>
              <Typography align="center">
                198 Cirby Way Suite 135, <br />
                Roseville, CA, 95678
              </Typography>
            </Grid2>

            {/* Social Media Section */}
            <Grid2
                item
                xs={12} sm={6} md={4}
                display="flex"
                flexDirection="column"
                alignItems="center" // Always centered
            >
              <Typography variant="h5" gutterBottom>
                CONNECT WITH US
              </Typography>
              <Box>
                <IconButton color="inherit" href="https://www.facebook.com" target="_blank" aria-label="Facebook">
                  <Facebook />
                </IconButton>
                <IconButton color="inherit" href="https://www.instagram.com" target="_blank" aria-label="Instagram">
                  <Instagram />
                </IconButton>
              </Box>
            </Grid2>

            {/* Business Hours Section */}
            <Grid2
                item
                xs={12} sm={12} md={4}
                display="flex"
                flexDirection="column"
                alignItems={{ xs: 'center', md: 'flex-end' }} // Centered on mobile, aligned right on desktop
            >
              <Typography variant="h5" gutterBottom>
                BUSINESS HOURS
              </Typography>
              <Grid2 container justifyContent="center">
                <Grid2 item xs={12} sm={6}>
                  <Typography align="left">
                    Monday: <br />
                    Tuesday/Wednesday: <br />
                    Thursday: <br />
                    Friday/Saturday: <br />
                    Sunday:
                  </Typography>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <Typography align="right">
                    Closed <br />
                    10 AM - 6 PM <br />
                    10 AM - 7 PM <br />
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