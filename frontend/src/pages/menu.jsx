import React, { useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ItemCard from '../components/ItemCard';

function SubscriptionLounge() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handlePurchase = (itemName) => {
    toast.success(`${itemName} added to your cart!`);
  };

  // Subscription and Lounge options
  const items = [
    {
      name: 'Monthly Membership',
      description: `What's included:\n• $80 towards any reTreat service (excludes salon services)\n• Free add-on of hot stones or aromatherapy\n• Unlimited use of the reLaxation Lounge and beverage service\n• 10% off ALL spa services and retail\n• 50% off eVent Lounge rental\n• Member Only Specials and Events\n\nSmall but important details:\n- Non-transferable. Unused credit remains on your account for six months.\n- Three-month minimum commitment.\n- If canceled, benefits terminate immediately, but you have 60 days to use remaining credit.\n- Cancellations require a 30-day written notice.`,
      price: '$80/month',
      category: 'Subscriptions'
    },
    {
      name: 'eVent Lounge Rental (Half Day)',
      description: `Perfect private space for birthdays, bridal parties, baby showers, graduations, and more!\nIncludes a dedicated team member for planning and assistance.\nSnack plate and beverage of choice included.\nYou may bring your own food, drinks, and decor.`,
      price: '$100 Half Day',
      category: 'Lounge Access'
    },
    {
      name: 'eVent Lounge Rental (Full Day)',
      description: `Perfect private space for birthdays, bridal parties, baby showers, graduations, and more!\nIncludes a dedicated team member for planning and assistance.\nSnack plate and beverage of choice included.\nYou may bring your own food, drinks, and decor.`,
      price: '$200 Full Day',
      category: 'Lounge Access'
    },
    {
      name: 'Hourly eVent Lounge Rental',
      description: `Includes $30 beverage package, snack plate available for pre-order at $10 per person.`,
      price: '$30/hour',
      category: 'Lounge Access'
    }
  ];

  const categories = ['All', 'Subscriptions', 'Lounge Access'];

  return (
    <div>
      <ToastContainer />

      {/* Header Section */}
      <Box textAlign="center" p={5} bgcolor="#e0e0e0">
        <Typography variant="h3" sx={{ fontFamily: 'Special Elite' }}>
          Subscriptions & Lounge
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

      {/* Cards Section */}
      <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
        {items
          .filter((item) => selectedCategory === 'All' || item.category === selectedCategory)
          .map((item, index) => (
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

export default SubscriptionLounge;