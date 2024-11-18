import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ItemCard from '../components/ItemCard'; // Import the ItemCard component

function SpaMenuPage() {
  // Handle purchase logic
  const handlePurchase = (itemName) => {
    toast.success(`${itemName} added to your cart!`);
  };

  // Menu items data
  const menuItems = [
    {
      name: 'Deluxe Spa Package',
      description: 'Includes\n• Signature facial with addon\n• 60 minute Swedish massage\n• Lounge access with robes',
      price: '$210',
    },
    {
      name: 'Luxury Spa Package',
      description: 'Includes\n• Luxury anti-aging facial with addon\n• 100 minute Swedish massage\n• Lounge access with robes',
      price: '$290',
    },
    {
      name: 'Customizable Spa Package',
      description: 'Customize with\n• Manicure\n• Pedicure\n• Body scrub treatment',
      price: '$???',
    },
  ];

  return (
    <div>
      {/* Toast Notifications */}
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

      {/* Cards Section */}
      <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ItemCard
              name={item.name}
              description={item.description}
              price={item.price}
              onPurchase={() => handlePurchase(item.name)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default SpaMenuPage;