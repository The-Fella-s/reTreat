// src/pages/MeetTheTeam.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardMedia,
  CardContent, Collapse, IconButton, CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

export default function MeetTheTeam() {
  const [team, setTeam]       = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/employees');
        setTeam(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py:4, backgroundColor:'#f5f5f5' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Meet the Team
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {team.map((emp, i) => (
          <Grid item key={emp._id} xs={12} sm={6} md={4} lg={3} sx={{ textAlign:'center' }}>
            <Card sx={{ maxWidth:300, mx:'auto' }}>
              {emp.profilePicture && (
                <CardMedia
                  component="img"
                  height="400"
                  image={emp.profilePicture}
                  alt={`${emp.firstName} ${emp.lastName}`}
                  sx={{ objectFit:'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6">
                  {emp.firstName} {emp.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {emp.profession}
                </Typography>
              </CardContent>

              {emp.description && (
                <>
                  <IconButton
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    aria-expanded={expanded === i}
                  >
                    {expanded === i ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                  <Collapse in={expanded === i} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography variant="body2">{emp.description}</Typography>
                    </CardContent>
                  </Collapse>
                </>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
