import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Box, LinearProgress, Grid } from '@mui/material';
import { Star } from '@mui/icons-material';

const ROTATION_INTERVAL = 3600000;

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/places/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();


        const filteredReviews = (data.reviews || []).filter(review => review.rating === 5);
        setReviews(filteredReviews);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev === 100 ? 0 : Math.min(prev + (100 / (ROTATION_INTERVAL / 1000)), 100)));
    }, 1000);

    const rotationTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 3 >= reviews.length ? 0 : prevIndex + 3));
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

  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  return (
    <div style={{ padding: '20px', maxWidth: '2000px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontFamily: "Special Elite" }}>
        Reviews
      </Typography>
      <Grid container spacing={2}>
        {visibleReviews.map((review, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{ minHeight: '225px', position: 'relative' }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar src={review.profile_photo_url} style={{ marginRight: '10px' }} />
                  <Box>
                    <Typography variant="h6">{review.author_name}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" marginTop={1}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} style={{ color: '#FFD700' }} />
                  ))}
                </Box>
                <Typography variant="body2" style={{ marginTop: '10px', textAlign: 'left', minHeight: '80px' }}>
                  {review.text}
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
