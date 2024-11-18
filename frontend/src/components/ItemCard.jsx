import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Grid, Card, CardContent, CardActions, CardMedia } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ItemCard({ name, description, price, onPurchase }) {
  return (
    <Card style={{ maxWidth: 345, margin: 'auto', backgroundColor: '#f5f5f5' }}>
      <CardMedia
        component="div"
        style={{ height: '150px', backgroundColor: '#e0e0e0' }} // Placeholder for image
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between', padding: '16px' }}>
        <Typography variant="h6">{price}</Typography>
        <Button variant="contained" color="primary" onClick={onPurchase}>Purchase</Button>
      </CardActions>
    </Card>
  );
}

export default ItemCard;