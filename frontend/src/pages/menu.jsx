import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Container } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import ItemCard from '../components/ItemCard';

function SpaMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setMenuItems(res.data);
        const uniqueCategories = Array.from(
          new Set(
            res.data.map(item =>
              typeof item.category === 'object' && item.category !== null
                ? item.category.name
                : item.category
            )
          )
        );
        setCategories(['All', ...uniqueCategories]);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    }
    fetchServices();
  }, []);

  const handleAddToCart = (serviceName) => {
    axios
      .post('http://localhost:5000/api/carts/add/service', {
        email: 'jordan@example.com',
        serviceName: serviceName,
        quantity: 1,
      })
      .then((res) => {
        toast.success(`${serviceName} added to cart`);
      })
      .catch((err) => {
        console.error('Error adding to cart:', err);
        toast.error('Failed to add to cart');
      });
  };

  const handleBookAppointment = () => {
    navigate('/cart');
  };

  return (
    <Container>
      <ToastContainer />
      <Box position="relative" textAlign="center" p={5} bgcolor="#e0e0e0">
        <Typography variant="h3" sx={{ fontFamily: 'Special Elite' }}>
          Menu
        </Typography>
        <Button
          variant="contained"
          onClick={handleBookAppointment}
          sx={{ position: 'absolute', top: 20, right: 20 }}
        >
          Book Appointment
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" p={2} flexWrap="wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'contained' : 'outlined'}
            sx={{ margin: '5px' }}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </Box>
      <Grid container spacing={3} justifyContent="center" sx={{ padding: '20px' }}>
        {menuItems
          .filter(item => {
            const itemCategory =
              typeof item.category === 'object' && item.category !== null
                ? item.category.name
                : item.category;
            return selectedCategory === 'All' || itemCategory === selectedCategory;
          })
          .map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ItemCard
                name={item.name}
                description={item.description}
                price={`$${item.pricing}`}
                onPurchase={() => handleAddToCart(item.name)}
              />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

export default SpaMenuPage;
