import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Box, LinearProgress } from '@mui/material';
import { Star } from '@mui/icons-material';

const ROTATION_INTERVAL = 5000;

const Reviews = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //this is meant to make use of the route set up in the google route
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/places/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        

        const formattedReviews = data.reviews.map(review => ({
          name: review.author_name,
          date: new Date(review.time * 1000).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          content: review.text,
          rating: review.rating,
          profilePhoto: review.profile_photo_url
        }));
        
        setReviews(formattedReviews);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Progress bar and rotation logic
  useEffect(() => {
    if (reviews.length === 0) return;

    const progressTimer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        return Math.min(oldProgress + (100 / (ROTATION_INTERVAL / 100)), 100);
      });
    }, 100);

    const rotationTimer = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => 
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0);
    }, ROTATION_INTERVAL);

    return () => {
      clearInterval(progressTimer);
      clearInterval(rotationTimer);
    };
  }, [reviews.length]);

  if (loading) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontFamily: "Special Elite" }}>
          Loading Reviews...
        </Typography>
        <LinearProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontFamily: "Special Elite" }}>
          Error Loading Reviews
        </Typography>
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontFamily: "Special Elite" }}>
          No Reviews Available
        </Typography>
      </div>
    );
  }

  const currentReview = reviews[currentReviewIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontFamily: "Special Elite" }}>
        Reviews
      </Typography>
      <Card sx={{ minHeight: '200px', position: 'relative' }}> 
        <CardContent>
          <Box display="flex" alignItems="center">
            <Avatar 
              src={currentReview.profilePhoto} 
              style={{ marginRight: '10px' }}
            />
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