import React, { useState } from 'react';
import { Box, Typography, Grid, Button, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ItemCard from '../components/ItemCard';

function SpaMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const handleBook = (itemName) => {
    toast.success(`${itemName} booking initiated!`);
    navigate('/appointment'); // Redirects to appointment page
  };

  // Menu items data
  const menuItems = [
    { name: 'Deluxe Spa Package', description: 'Includes\n• Signature facial with addon\n• 60 minute Swedish massage\n• Lounge access with robes', price: '$210', category: 'Packages' },
    { name: 'Luxury Spa Package', description: 'Includes\n• Luxury anti-aging facial with addon\n• 100 minute Swedish massage\n• Lounge access with robes', price: '$290', category: 'Packages' },
    { name: 'Customizable Spa Package', description: 'Customize with\n• Manicure\n• Pedicure\n• Body scrub treatment', price: '$???', category: 'Packages' },
    { name: 'Monthly Membership', description: `What's included:\n• $80 towards any reTreat service (excludes salon services)\n• Free add-on of hot stones or aromatherapy\n• Unlimited use of the reLaxation Lounge and beverage service\n• 10% off ALL spa services and retail`, price: '$80/month', category: 'Subscriptions' },
    { name: 'eVent Lounge Rental (Half Day)', description: `Perfect private space for birthdays, bridal parties, baby showers, graduations, and more!`, price: '$100 Half Day', category: 'Lounge' },
    { name: 'eVent Lounge Rental (Full Day)', description: `Perfect private space for birthdays, bridal parties, baby showers, graduations, and more!`, price: '$200 Full Day', category: 'Lounge' },
    { name: 'Hourly eVent Lounge Rental', description: `Includes $30 beverage package, snack plate available for pre-order at $10 per person.`, price: '$30/hour', category: 'Lounge' }
  ];

  const categories = ['All', 'Packages', 'Subscriptions', 'Lounge'];

  return (
    <Container>
      <ToastContainer />

      {/* Header Section */}
      <Box textAlign="center" p={5} bgcolor="#e0e0e0">
        <Typography variant="h3" sx={{ fontFamily: 'Special Elite' }}>
          Menu
        </Typography>
      </Box>

      {/* Filter Buttons */}
      <Box display="flex" justifyContent="center" p={2} flexWrap="wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'contained' : 'outlined'}
            style={{ margin: '5px' }}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </Box>

      {/* Cards Section - Fixed Filtering */}
      <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
        {menuItems
          .filter(item => selectedCategory === 'All' || item.category === selectedCategory) // ✅ Restored Filtering
          .map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ItemCard
                name={item.name}
                description={item.description}
                price={item.price}
                onPurchase={() => handleBook(item.name)} // ✅ Redirects to /appointment
              />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

export default SpaMenuPage;
