import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from '@mui/material';

import ItemCard from "../../components/ItemCard";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file); // Generate a temporary URL for preview
    setNewItem({ ...newItem, image: imageUrl });
  };

  // Add the new item to the menu
  const handleAddItem = () => {
    setMenuItems([...menuItems, newItem]);
    setNewItem({ name: '', description: '', price: '', image: '' }); // Reset form
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Menu Management
      </Typography>

      {/* Form to Add New Menu Item */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: '400px',
          marginBottom: 4,
        }}
      >
        <TextField
          label="Title"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={newItem.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
        />
        <TextField
          label="Price"
          name="price"
          value={newItem.price}
          onChange={handleInputChange}
          fullWidth
        />
        <Button variant="contained" component="label">
          Upload Image
          <input type="file" hidden onChange={handleImageUpload} />
        </Button>
        {newItem.image && (
          <CardMedia
            component="img"
            src={newItem.image}
            alt="Preview"
            sx={{ height: 150, width: 'auto', marginTop: 2 }}
          />
        )}
        <Button variant="contained" onClick={handleAddItem}>
          Add to Menu
        </Button>
      </Box>

      {/* Live Preview */}
      <Typography variant="h5" gutterBottom>
        Preview
      </Typography>
      {newItem.name && (
        <Box sx={{ marginBottom: 4 }}>
          <ItemCard
            name={newItem.name}
            description={newItem.description}
            price={newItem.price}
            onPurchase={() => {}}
          />
        </Box>
      )}

      {/* Menu Items Grid */}
      <Typography variant="h5" gutterBottom>
        Menu Items
      </Typography>
      <Grid container spacing={3}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ItemCard
              name={item.name}
              description={item.description}
              price={item.price}
              onPurchase={() => {}}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenuSection;
