import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';

function ItemCard({ name, description, price, onPurchase }) {
  return (
    <Card style={{ maxWidth: 345, margin: 'auto', backgroundColor: '#f5f5f5' }}>
      {/* Removed Grey Placeholder Box */}
      
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
