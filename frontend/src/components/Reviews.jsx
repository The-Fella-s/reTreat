import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Star } from '@mui/icons-material'; // For rating stars

// Sample reviews data
const reviews = [
  {
    name: 'Lauren',
    date: 'June 20th, 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
    rating: 5,
  },
  {
    name: 'Katya N',
    date: 'August 15th, 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
    rating: 5,
  },
  {
    name: 'Scott Thomas',
    date: 'June 3rd, 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
    rating: 5,
  },
];

const Reviews = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Reviews
      </Typography>
      <Grid container spacing={2}>
        {reviews.map((review, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar style={{ marginRight: '10px' }} />
                  <Box>
                    <Typography variant="h6" component="div">
                      {review.name}
                    </Typography>
                    {/* Date beneath the name */}
                    <Typography color="textSecondary">
                      {review.date}
                    </Typography>
                  </Box>
                </Box>

                {/* Star Rating */}
                <Box display="flex" alignItems="center" marginTop={1}>
                  {[...Array(5)].map((_, i) =>
                    i < review.rating ? (
                      <Star key={i} style={{ color: '#FFD700' }} /> // Gold filled star
                    ) : (
                      <StarBorder key={i} style={{ color: '#FFD700' }} /> // Gold empty star
                    )
                  )}
                </Box>

                {/* Review Content */}
                <Typography variant="body2" style={{ marginTop: '10px', textAlign: 'left' }}>
                  {review.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Reviews;
