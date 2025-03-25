import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Avatar,
  TextField,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], menu: null, user: '' });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded userId for demonstration (replace as needed)
  const userId = "67de456310bc38cfd38f660a";
  const baseUrl = "http://localhost:5000/api";

  // Fetch the current cart from the API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/carts/${userId}`);
      setCart(res.data);
      if (res.data.items && res.data.items.length > 0) {
        const items = res.data.items.map((item) => {
          if (item.service && item.service.name) {
            return {
              id: item.service._id,
              name: item.service.name,
              price: item.service.pricing,
              quantity: item.quantity,
              imageUrl: item.service.imageUrl || '',
            };
          } else {
            return {
              id: item.service,
              name: "Unknown Service",
              price: 0,
              quantity: item.quantity,
              imageUrl: '',
            };
          }
        });
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Function to remove a service from the cart via API
  const handleRemoveService = async (serviceId) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${baseUrl}/carts/remove/service/${userId}/${serviceId}`);
      setCart(res.data);
      if (res.data.items && res.data.items.length > 0) {
        const items = res.data.items.map((item) => {
          if (item.service && item.service.name) {
            return {
              id: item.service._id,
              name: item.service.name,
              price: item.service.pricing,
              quantity: item.quantity,
              imageUrl: item.service.imageUrl || '',
            };
          } else {
            return {
              id: item.service,
              name: "Unknown Service",
              price: 0,
              quantity: item.quantity,
              imageUrl: '',
            };
          }
        });
        setCartItems(items);
      } else {
        setCartItems([]);
      }
      toast.success("Service removed from cart");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to remove service");
    } finally {
      setLoading(false);
    }
  };

  // Local quantity update
  const handleQuantityChange = (serviceId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === serviceId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleProceedToCheckout = () => {
    navigate('/payment');
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h4" sx={{ mb: 3 }}>Your Shopping Cart</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : cartItems.length > 0 ? (
        <Grid container spacing={3}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Avatar src={item.imageUrl} alt={item.name} sx={{ width: 100, height: 100 }} />
                <Box sx={{ ml: 2, flex: 1 }}>
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
                <IconButton
                  onClick={() => handleRemoveService(item.id)}
                  color="error"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
                <Typography sx={{ ml: 3 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Typography variant="h5">Total: ${getTotalPrice()}</Typography>
              <Button variant="contained" color="primary" onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Your cart is empty.</Typography>
          <Button variant="outlined" onClick={fetchCart}>Refresh Cart</Button>
        </Box>
      )}
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={fetchCart}>
          Refresh Cart
        </Button>
      </Box>
    </Box>
  );
};

export default ShoppingCart;
