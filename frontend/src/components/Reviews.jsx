import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import Grid from '@mui/material/Grid'; // Import Grid from @mui/material/Grid
import { Star } from '@mui/icons-material'; // Importing Star icon for ratings

// Sample reviews data
const reviews = [
  {
    name: 'Lauren',
    date: 'June 20th, 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    rating: 5,
  },
  {
    name: 'Katya N',
    date: 'August 15th, 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    rating: 5,
  },
  {
    name: 'Scott Thomas',
    date: 'June 3rd, 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
          <Grid item xs={12} sm={6} md={4} key={index}> {/* Responsive grid item */}
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar style={{ marginRight: '10px' }} />
                  <Box>
                    <Typography variant="h6" component="span">
                      {review.name}
                    </Typography>
                    <Typography color="textSecondary" component="span" style={{ marginLeft: '10px' }}>
                      {review.date}
                    </Typography>
                  </Box>
                </Box>
                {/* Star Rating */}
                <Box display="flex" alignItems="center" marginTop={1}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} color="primary" />
                  ))}
                </Box>
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
