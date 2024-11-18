import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material'; // Import icons for social media

const socialMediaPosts = [
  {
    platform: 'Facebook',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'https://facebook.com',
  },
  {
    platform: 'Twitter',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'https://twitter.com',
  },
  {
    platform: 'Instagram',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'https://instagram.com',
  },
];

const SocialMedia = () => {
  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom align="center" sx = {{fontFamily: "Special Elite"}}>
        Social Media
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {socialMediaPosts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}> 
            <Card>
              <CardContent>
                <Typography variant="h6" style={{ textAlign: 'left' }}>
                  {post.platform}
                </Typography>
                <Typography variant="body2" style={{ marginBottom: '10px', textAlign: 'left' }}>
                  {post.content}
                </Typography>
                <Button 
                //setting up this button just to show that it can link to the sites
                  variant="contained" 
                  color="primary" 
                  href={post.link} 
                  target="_blank" 
                  startIcon={getSocialMediaIcon(post.platform)} 
                >
                  View Post
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Function to return the corresponding icon based on the platform
const getSocialMediaIcon = (platform) => {
  switch (platform) {
    case 'Facebook':
      return <Facebook />;
    case 'Twitter':
      return <Twitter />;
    case 'Instagram':
      return <Instagram />;
    default:
      return null;
  }
};

export default SocialMedia;
