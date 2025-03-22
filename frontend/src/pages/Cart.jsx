// ShoppingCart.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Grid, Avatar, TextField, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], menu: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Example: local state to simulate cart items; in a real app, you might fetch the cart on mount
  const [cartItems, setCartItems] = useState([]);

  // Function to handle adding a service to the cart
  const handleAddService = async () => {
    try {
      setLoading(true);
      // Replace these with actual values from a form or state
      const userEmail = 'user@example.com';
      const serviceName = 'Service A';
      const quantity = 1;
      // const updatedCart = await addServiceToCart({ userEmail, serviceName, quantity });
      // setCart(updatedCart);
      // // Optionally, update your local cartItems state as well
      // setCartItems(updatedCart.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to remove a service from the cart
  const handleRemoveService = async (serviceId) => {
    try {
      setLoading(true);
      const userId = cart.user; // ensure this matches the current user
      // const updatedCart = await removeServiceFromCart({ userId, serviceId });
      // setCart(updatedCart);
      // setCartItems(updatedCart.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Example: updating item quantity locally (you might want to integrate an update endpoint)
  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevItems) =>
        prevItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  useEffect(() => {
    // On component mount, you could fetch the current cart from an endpoint.
    // Example: fetchCart();
  }, []);

  return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Your Shopping Cart</Typography>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
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
                      <IconButton onClick={() => handleRemoveService(item.id)} color="error">
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

        {/* A simple button to add a service to the cart (for demo purposes) */}
        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={handleAddService}>
            Add Example Service
          </Button>
        </Box>
      </Box>
  );
};

export default ShoppingCart;
