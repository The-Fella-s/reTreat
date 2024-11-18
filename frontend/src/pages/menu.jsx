import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Grid, Card, CardContent, CardActions, CardMedia } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SpaMenuPage() {

  const handlePurchase = () => {
    toast.success("Purchase added..."); // Display the toast notification
  };

  return (
    <div>
      {/* Toast Container */}
      <ToastContainer />

      {/* Header Section */}
      <Box textAlign="center" p={5} bgcolor="#e0e0e0">
        <Typography variant="h3" sx = {{fontFamily: "Special Elite"}}>Menu</Typography>
      </Box>

      {/* Filter Buttons */}
      <Box display="flex" justifyContent="center" p={2} flexWrap="wrap">
        {['Rentals', 'Package', 'Massage', 'Body Scrub', 'Facials', 'Waxing', 'Lashes', 'Nail Care'].map((category) => (
          <Button key={category} variant="outlined" style={{ margin: '5px' }}>
            {category}
          </Button>
        ))}
      </Box>

      {/* Card Grid */}
      <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
        {[ 
          { title: 'Deluxe Spa Package', description: 'Includes\n• Signature facial with addon\n• 60 minute Swedish massage\n• Lounge access with robes', price: '$210' },
          { title: 'Luxury Spa Package', description: 'Includes\n• Luxury anti-aging facial with addon\n• 100 minute Swedish massage\n• Lounge access with robes', price: '$290' },
          { title: 'Customizable Spa Package', description: 'Customize with\n• Manicure\n• Pedicure\n• Body scrub treatment', price: '$???' }
        ].map((packageItem, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card style={{ maxWidth: 345, margin: 'auto', backgroundColor: '#f5f5f5' }}>
              <CardMedia
                component="div"
                style={{ height: '150px', backgroundColor: '#e0e0e0' }} // Placeholder for image
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {packageItem.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {packageItem.description.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </Typography>
              </CardContent>
              <CardActions style={{ justifyContent: 'space-between', padding: '16px' }}>
                <Typography variant="h6">{packageItem.price}</Typography>
                <Button variant="contained" color="primary"onClick={handlePurchase}>Purchase</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default SpaMenuPage;
