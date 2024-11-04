import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Box, LinearProgress } from '@mui/material'; // Added LinearProgress
import { Star } from '@mui/icons-material';

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
    content: 'The devil went down to georgia and he was looking for a soul to steal',
    rating: 5,
  },
  {
    name: 'Scott Thomas',
    date: 'June 3rd, 2024',
    content: 'he was in a bind because he was way behind and he was willing to make a deal',
    rating: 5,
  },
];

const ROTATION_INTERVAL = 5000; // Define rotation interval constant as 5000 milliseconds

const Reviews = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar update timer
    const progressTimer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        return Math.min(oldProgress + (100 / (ROTATION_INTERVAL / 100)), 100);
      });
    }, 100);

    // Review rotation timer
    const rotationTimer = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => 
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0); // Reset progress when review changes
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(progressTimer);
      clearInterval(rotationTimer);
    };
  }, []);

  const currentReview = reviews[currentReviewIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Reviews
      </Typography>
      <Card sx={{ minHeight: '200px', position: 'relative' }}> 
        <CardContent>
          <Box display="flex" alignItems="center">
            <Avatar style={{ marginRight: '10px' }} />
            <Box>
              <Typography variant="h6" component="div">
                {currentReview.name}
              </Typography>
              <Typography color="textSecondary">
                {currentReview.date}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" marginTop={1}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                style={{ 
                  color: i < currentReview.rating ? '#FFD700' : '#D3D3D3'
                }} 
              />
            ))}
          </Box>
          <Typography 
            variant="body2" 
            style={{ 
              marginTop: '10px', 
              textAlign: 'left',
              minHeight: '80px'
            }}
          >
            {currentReview.content}
          </Typography>
        </CardContent>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '4px',
            '& .MuiLinearProgress-bar': {
              transition: 'none'
            }
          }}
        />
      </Card>
    </div>
  );
};

export default Reviews;