import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Grid, Avatar, TextField, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
    {/* dummy data for now */}
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Spiced Apple Cider Body Treatment',
      price: 180.00,
      quantity: 2,
      imageUrl: 'https://via.placeholder.com/100'
    },
    {
      id: 2,
      name: 'reTreat Blissful Back Treatment',
      price: 95.00,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/100'
    },

  ]);

  const navigate = useNavigate();

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Your Shopping Cart</Typography>
      {cartItems.length > 0 ? (
        <Grid container spacing={3}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Avatar src={item.imageUrl} alt={item.name} sx={{ width: 100, height: 100 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography>Price: ${item.price.toFixed(2)}</Typography>
                </Box>
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, Math.max(1, parseInt(e.target.value)))}
                  sx={{ width: 80 }}
                />
                <IconButton onClick={() => handleRemoveItem(item.id)} color="error">
                  <DeleteIcon />
                </IconButton>
                <Typography sx={{ ml: 3 }}>${(item.price * item.quantity).toFixed(2)}</Typography>
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Typography variant="h5">Total: ${getTotalPrice()}</Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/payment')}>
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Your cart is empty.</Typography>
          <CircularProgress sx={{ color: 'gray' }} />
        </Box>
      )}
    </Box>
  );
};

export default ShoppingCart;
