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
          description: 'Holly has spent nearly ten years in the industry and is ready to take on more. She has a passion for all things hair and loves when she gets to play with fashion colors, bridal and prom styles, as well as creative haircuts. Because of her background in teaching and coaching, Holly is excited to take on the role as co-owner and strives to make reTreat a place where all guests can come relax and get pampered.'
        },
        {
          fullName: 'Danniel',
          title: 'Co-Owner & Energy Worker & Hairstylist',
          imageUrl: 'src/assets/team_photos/danniel.webp',
          description: 'Danniel brings many years of experience behind the chair as well as tools from her background as a Paul Mitchell educator. She loves the connection she gets to build and share with each of her guests and is especially known for her shampoo services and massage during her facials! Danniel has been growing her bag of tools to include healing on a deeper level. Danniel is a Reiki Master and loves to use her intuitive and heart centered gift with reTreat guests. She loves the deep connection she gets to share will anyone in her space. Every tiny detail is thought of at reTreat Salon & Spa to create a soothing space for you and all of your beauty needs.'
        },
        {
          fullName: 'Angela',
          title: 'Hairstylist & Lash Artist',
          imageUrl: 'src/assets/team_photos/angela.webp',
          description: 'Angela is excited to bring her ten years of experience to reTreat as both a lash artist and a cosmetologist. She enjoys using color-based techniques like ombres and balayages, doing men\'s haircuts and styles as well as giving you a new look with her background in lash artistry.'
        },
        {
          fullName: 'Lauren',
          title: 'Spa Manager & Hairstylist',
          imageUrl: 'src/assets/team_photos/lauren.webp',
          description: 'Lauren has been in the beauty industry for 10 years. She enjoys all aspects of being behind the chair, from meeting new people to making sure every guest feels good about themselves. Lauren specializes in Keratin smoothers and hair cutting. She is excited to hear each guest\'s story and is thrilled at the opportunity to apply her expertise, education, and love of this industry into her work every day.'
        },
        {
          fullName: 'Evgenia',
          title: 'Esthetician',
          imageUrl: 'src/assets/team_photos/evgenia.webp',
          description: 'Evgenia is a licensed esthetician who works with any and all skin types. She offers facial lifts, facial massages, ultra-sonic facial cleansing, and more. Evgenia is fluent in Russian, Gagauzian and Bulgarian and she can also understand Turkish and Maldovian.'
        },
        {
          fullName: 'Vy',
          title: 'Nail Technician',
          imageUrl: 'src/assets/team_photos/vy.webp',
          description: 'Vy has over 10 years of experience in all types of manicures, pedicures, and the latest nail art designs. Her friendly and welcoming nature makes every client feel comfortable, allowing for a personalized and enjoyable experience every visit.'
        },
        {
          fullName: 'Franny',
          title: 'Receptionist',
          imageUrl: 'src/assets/team_photos/franny.webp',
          description: 'Franny loves connecting and fostering positive relationships with anyone she encounters. Franny is currently an Instructional Aide for kids at an elementary school and hopes to further her career by finishing her psychology degree and obtaining her teaching credits.'
        },
        {
          fullName: 'Megan',
          title: 'Esthetician',
          imageUrl: 'src/assets/team_photos/megan.webp',
          description: 'Megan\'s love of beautifying the skin began at age seventeen when her own Esthetician began to educate her about the science behind healthy skin care. Since then, Megan has been passionate about helping others care for their skin and enjoys listening to and discussing all things skin wellness with her clients. She is especially skilled at identifying the factors underlying her client\'s concerns and most loves restoring balance and calm to the delicate skin barrier. Megan combines her background of counseling and teaching with the world of esthetics, and thoroughly enjoys educating her clients about a healthy home care and clinical routine. Her goal is to see each client leave her treatment room relaxed, refreshed and confident of how to best care for their skin.'
        },
        {
          fullName: 'Ashlyn',
          title: 'Receptionist',
          imageUrl: 'src/assets/team_photos/ashlyn.webp',
          description: 'Ashlyn is so excited to have joined the amazing team at reTreat! She recently relocated from Portland, Oregon where she was a student at Portland State University. Although she is new to being around the beauty industry, she is excited to learn all she can while making every guest feel as welcomed and pampered as possible.'
        },
        {
          fullName: 'Sofiya',
          title: 'Esthetician & Receptionist',
          imageUrl: 'src/assets/team_photos/sofiya.webp',
          description: 'Sofiya joins reTreat at our front desk and also in our esthetics department! She has loved the beauty industry since being a teenager and looks forward to growing her skills and working with her guests on their skincare journey!'
        },
        {
          fullName: 'Irina',
          title: 'Massage Therapist',
          imageUrl: 'src/assets/team_photos/irina.webp',
          description: 'Irina has been a massage therapist since 2006. She was born in the country of Georgia and has a background in economics and accounting. Upon coming to America in 2005, she immediately attended Healing Arts Institute. Her journey was difficult with her not fully understanding English and had everything translated throughout her schooling. Despite these hardships, she continued on and is now pursuing listening to clients\' needs and concerns, creating customized massage sessions that promote relaxation, and overall wellness. She is committed to fostering a nurturing and soothing environment for our clients, ensuring that each massage session is a holistic experience that addresses both physical and mental well-being.'
        },
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
                alt={member.name}
                sx={{ objectFit: 'contain' }}
              />
              
              {/* Card Content */}
              <CardContent>
                <Typography variant="h6" component="div">
                  {member.name}
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
