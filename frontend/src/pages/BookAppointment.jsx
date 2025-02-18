import React, { useState, useEffect } from 'react';
import { Typography, Grid2, Button, Box } from '@mui/material';
import AppointmentCard from '../components/AppointmentCard.jsx';
import { formatDuration } from '../utilities/formatDuration.js';
import services from '../temporarydata/Services.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = ['Body Treatments', 'Facials', 'Nanochanneling Facials', 'Hydrafacials', 'Dermaplaning', 'Dermabrasion', 'Nail Care', 'Massages', 'Waxing', 'Add-Ons'];

const BookAppointment = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('Body Treatments');
  const [isDataPopulated, setIsDataPopulated] = useState(false); // Track if data is populated

  /*

  DEPRECATED METHOD TO ADD/DELETE/MODIFY SERVICES 

    - TRACKS CHANGES FROM Services.jsx AND CONNECTS TO FRONT AND BACK END TO UPDATE
    - NOW USING BookingSection.jsx FROM THE ADMIN SIDE


  // Function to check and populate new data into MongoDB
  const handlePopulateData = async () => {
    try {
      // Fetch existing services from the database
      const response = await axios.get('http://localhost:5000/api/appointments');
      const existingAppointments = response.data; // Get existing services from DB
  
      // Format the current services in services.jsx
      const formattedAppointments = Object.values(services[0]).map(service => ({
        name: service.name || "Unknown",
        pricing: service.pricing !== undefined ? service.pricing : 0,
        duration: service.duration || "0:30:00",
        category: service.category || "Unknown",
        description: service.description && service.description.length > 0 ? service.description.join(' ') : "No description available"
      }));
  
      // Find the new services that are not in the database
      const newAppointments = formattedAppointments.filter(service =>
        !existingAppointments.some(existingService => existingService.name === service.name)
      );
  
      // Find the deleted services that are in the database but no longer in services.jsx
      const deletedAppointments = existingAppointments.filter(existingService =>
        !formattedAppointments.some(service => service.name === existingService.name)
      );
  
      // If there are new services, send them to the backend to be populated
      if (newAppointments.length > 0) {
        const postResponse = await axios.post('http://localhost:5000/api/appointments/populate', { appointments: newAppointments });
        if (postResponse.status === 201) {
          console.log('New appointments populated successfully');
        } else {
          console.log('Unexpected response:', postResponse);
        }
      }
  
      // If there are deleted services, send them to the backend to be removed
      if (deletedAppointments.length > 0) {
        const deletePromises = deletedAppointments.map(deletedAppointment =>
          axios.delete(`http://localhost:5000/api/appointments/${deletedAppointment._id}`)
        );
        await Promise.all(deletePromises);
        console.log('Deleted appointments removed successfully');
      }
  
      setIsDataPopulated(true);
    } catch (error) {
      console.error('Error populating appointments:', error);
    }
  };
  

  // Effect to check if data has been populated and populate if not
  useEffect(() => {
    if (!isDataPopulated) {
      handlePopulateData();
    }
  }, [isDataPopulated]); // This will run once and only if data is not populated

  const handleAppointmentBookConfirm = (appointmentData) => {
    navigate('/payment', { state: { appointmentData } });
  };
  */

  return (
    <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box>
        <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', fontFamily: "Special Elite" }} xs={12} sm={6} md={4} p={5}>
          Book Appointment
        </Typography>

        <Grid2 container spacing={2} justifyContent="center" alignItems="center">
          {categories.map((category, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index}>
              <Button
                variant="outlined"
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  backgroundColor: selectedCategory === category ? '#1976d2' : '',
                  color: selectedCategory === category ? 'white' : '',
                }}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            </Grid2>
          ))}
        </Grid2>

        <Box p={5}>
          <Grid2 container direction="row" sx={{
            justifyContent: "center",
            alignItems: "center",
          }}>
            {Object.values(services[0]).map((service, index) => {
              const description = service.description;
              const category = service.category;
              const duration = service.duration;

              if (category === selectedCategory) {
                return (
                  <Grid2 item sx={{ p: 1.5 }} key={index}>
                    <AppointmentCard
                      title={service.name}
                      description={description.map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {line}
                          <br />
                        </span>
                      ))}
                      pricing={service.pricing}
                      duration={formatDuration(duration)}
                      onAppointmentBookConfirm={() => handleAppointmentBookConfirm(service)}
                    />
                  </Grid2>
                );
              }
            })}
          </Grid2>
        </Box>
      </Box>
    </Box>
  );
}

export default BookAppointment;
