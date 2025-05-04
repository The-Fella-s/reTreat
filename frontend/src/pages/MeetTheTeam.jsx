import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function MeetTheTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [expandedMember, setExpandedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const mockTeamMembers = [
        {
          fullName: 'Holly',
          title: 'Co-Owner & Hairstylist',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/holly.webp',
          description: 'Holly has spent nearly ten years in the industry and is ready to take on more...'
        },
        {
          fullName: 'Danniel',
          title: 'Co-Owner & Energy Worker & Hairstylist',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/danniel.webp',
          description: 'Danniel brings many years of experience behind the chair...'
        },
        {
          fullName: 'Angela',
          title: 'Hairstylist & Lash Artist',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/angela.webp',
          description: 'Angela is excited to bring her ten years of experience...'
        },
        {
          fullName: 'Lauren',
          title: 'Spa Manager & Hairstylist',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/lauren.webp',
          description: 'Lauren has been in the beauty industry for 10 years...'
        },
        {
          fullName: 'Evgenia',
          title: 'Esthetician',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/evgenia.webp',
          description: 'Evgenia is a licensed esthetician who works with any and all skin types...'
        },
        {
          fullName: 'Vy',
          title: 'Nail Technician',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/vy.webp',
          description: 'Vy has over 10 years of experience in all types of manicures...'
        },
        {
          fullName: 'Franny',
          title: 'Receptionist',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/franny.webp',
          description: 'Franny loves connecting and fostering positive relationships...'
        },
        {
          fullName: 'Megan',
          title: 'Esthetician',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/megan.webp',
          description: 'Megan\'s love of beautifying the skin began at age seventeen...'
        },
        {
          fullName: 'Ashlyn',
          title: 'Receptionist',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/ashlyn.webp',
          description: 'Ashlyn is so excited to have joined the amazing team at reTreat...'
        },
        {
          fullName: 'Sofiya',
          title: 'Esthetician & Receptionist',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/sofiya.webp',
          description: 'Sofiya joins reTreat at our front desk and also in our esthetics department...'
        },
        {
          fullName: 'Irina',
          title: 'Massage Therapist',
          imageUrl: 'https://retreatimages.s3.us-west-1.amazonaws.com/Employees/irina.webp',
          description: 'Irina has been a massage therapist since 2006...'
        }
      ];      

      try {
        setLoading(true);
        const response = await fetch('/api/team');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid JSON structure');
        }

        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members, using mock data:', error);
        setTeamMembers(mockTeamMembers);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleExpandClick = (index) => {
    setExpandedMember(expandedMember === index ? null : index);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', paddingTop: 4, paddingBottom: 4 }}
    >
      {/* Header Section */}
      <Typography variant="h3" gutterBottom sx={{ fontFamily: "Special Elite" }}>
        Meet the Team
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Meet our team of professionals to serve you
      </Typography>

      {/* Buttons */}
      <Box mb={4}>
        <Button 
          variant="contained" 
          sx={{ marginRight: 2, backgroundColor: '#333', color: '#fff' }}
          href="/about-us"
        >
          About Us
        </Button>
        <Button 
          variant="outlined" 
          sx={{ borderColor: '#333', color: '#333' }}
          href="/contact-us"
        >
          Contact Us
        </Button>
      </Box>

      {/* Team Members */}
      <Grid container spacing={3} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ textAlign: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
              {/* Image */}
              <CardMedia
                component="img"
                height="300"
                image={member.imageUrl}
                alt={member.fullName}
                sx={{ objectFit: 'contain' }}
              />
              
              {/* Card Content */}
              <CardContent>
                <Typography variant="h6" component="div">
                  {member.fullName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {member.title}
                </Typography>
                
                {/* Expandable description section */}
                {member.description && (
                  <>
                    <Box display="flex" justifyContent="center" mt={1}>
                      <IconButton
                        onClick={() => handleExpandClick(index)}
                        aria-expanded={expandedMember === index}
                        aria-label="show more"
                      >
                        {expandedMember === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                    <Collapse in={expandedMember === index} timeout="auto" unmountOnExit>
                      <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                        {member.description}
                      </Typography>
                    </Collapse>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MeetTheTeam;
