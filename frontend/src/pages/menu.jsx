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
    // Fetch services from the database
    axios.get('http://localhost:5000/api/services')
      .then((res) => {
        setMenuItems(res.data);
        // Derive unique categories from fetched services
        const uniqueCategories = Array.from(new Set(res.data.map(item => {
          // Assuming category is stored as an ObjectId or a name?
          // If category is an object with a name, use: item.category.name
          return typeof item.category === 'object' && item.category !== null
            ? item.category.name
            : item.category;
        })));
        setCategories(['All', ...uniqueCategories]);
      })
      .catch((err) => {
        console.error('Error fetching services:', err);
      });
  }, []);

  const handleBook = (itemName) => {
    toast.success(`${itemName} booking initiated!`);
    navigate('/appointment'); // Redirects to appointment page
  };

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

      {/* Cards Section */}
      <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
        {menuItems
          .filter(item => {
            const itemCategory = typeof item.category === 'object' && item.category !== null
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
                onPurchase={() => handleBook(item.name)}
              />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

export default SpaMenuPage;
