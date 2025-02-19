import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button, Box } from '@mui/material';
import AppointmentCard from '../components/AppointmentCard.jsx';
import { formatDuration } from '../utilities/formatDuration.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categories = ['Body Treatments', 'Facials', 'Nanochanneling Facials', 'Hydrafacials', 'Dermaplaning', 'Dermabrasion', 'Nail Care', 'Massages', 'Waxing', 'Add-Ons'];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Body Treatments');
  const [appointments, setAppointments] = useState([]);

  // Function to fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Auto-fetch appointments on mount & refresh every 10 seconds
  useEffect(() => {
    fetchAppointments(); // Fetch immediately
    const interval = setInterval(fetchAppointments, 10000); // Auto-refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup when unmounting
  }, []);

  const handleAppointmentBookConfirm = (appointmentData) => {
    navigate('/payment', { state: { appointmentData } });
  };

  return (
    <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box>
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold', fontFamily: "Special Elite" }}
          xs={12} sm={6} md={4} p={5}
        >
          Book Appointment
        </Typography>

        {/* Refresh Button */}
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <Button variant="contained" onClick={fetchAppointments}>Refresh Appointments</Button>
        </Box>

        {/* Horizontal category buttons */}
        <Box 
          sx={{ 
            display: "flex", 
            flexWrap: "nowrap", 
            overflowX: "auto", 
            justifyContent: "center", 
            gap: 2, 
            p: 2 
          }}
        >
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="outlined"
              style={{
                padding: '10px',
                textAlign: 'center',
                backgroundColor: selectedCategory === category ? '#1976d2' : '',
                color: selectedCategory === category ? 'white' : '',
                whiteSpace: "nowrap",
              }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </Box>

        <Box p={5}>
          <Grid container direction="row" sx={{ justifyContent: "center", alignItems: "center" }}>
            {appointments
              .filter(service => service.category === selectedCategory)
              .map((service, index) => (
                <Grid item sx={{ p: 1.5 }} key={index}>
                  <AppointmentCard
                    title={service.name}
                    description={
                      Array.isArray(service.description)
                        ? service.description.map((line, lineIndex) => (
                            <span key={lineIndex}>
                              {line}
                              <br />
                            </span>
                          ))
                        : service.description
                    }
                    pricing={service.pricing}
                    duration={formatDuration(service.duration)}
                    onAppointmentBookConfirm={() => handleAppointmentBookConfirm(service)}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default BookAppointment;
