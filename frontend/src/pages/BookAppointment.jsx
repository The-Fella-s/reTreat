import React, {useState} from 'react';
import {Typography, Grid2, Button, Box} from '@mui/material';
import AppointmentCard from '../components/AppointmentCard.jsx';
import {formatDuration} from '../utilities/formatDuration.js';
import services from '../temporarydata/Services.jsx';
import {useNavigate} from 'react-router-dom';

const categories = ['Body Treatments', 'Facials', 'Nanochanneling Facials', 'Hydrafacials', 'Dermaplaning', 'Dermabrasion', 'Nail Care', 'Massages', 'Waxing', 'Add-Ons'];

const BookAppointment = () => {
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('Body Treatments');

    // Navigate to payment page and pass the data via state
    const handleAppointmentBookConfirm = (appointmentData) => {
        navigate('/payment', { state: { appointmentData } });
    };

    return (

        // Centers the whole page
        <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Turns the title and category into a column */}
            <Box>

                {/* Title */}
                <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold',fontFamily: "Special Elite"}}  xs={12} sm={6} md={4} p={5}>
                    Book Appointment
                </Typography>

                {/* Centers the categories and put spacing between them */}
                <Grid2 container spacing={2} justifyContent="center" alignItems="center">
                    {categories.map((category, index) => (

                        // Add padding to the buttons
                        <Grid2 item xs={12} sm={6} md={4} key={index}>

                            {/* Button */}
                            <Button
                                variant="outlined"

                                // Background color changes to blue when the category is selected
                                // Text color changes to white when the category is selected
                                style={{
                                    padding: '10px',
                                    textAlign: 'center',
                                    backgroundColor: selectedCategory === category ? '#1976d2' : '', // Active button color
                                    color: selectedCategory === category ? 'white' : '', // Text color for active button
                                }}

                                // Updates category to the current one
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Button>
                        </Grid2>
                    ))}
                </Grid2>

                {/* Bottom padding */}
                <Box p={5}>

                    {/* Makes the cards stack horizontally and keep them centered */}
                    <Grid2 container direction="row" sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                        {Object.values(services[0]).map((service, index) => {
                            const description = service.description; // Get the array descriptions of the service
                            const category = service.category; // Get the category of the service
                            const duration = service.duration; // Get the duration of the service

                            {/* Check if the category is selected */}
                            if (category === selectedCategory) {
                                return (
                                    <Grid2 item sx={{p: 1.5}} key={index}>
                                        <AppointmentCard
                                            title={service.name}
                                            description={description.map((line, lineIndex) => (
                                                <span key={lineIndex}>
                                                    {line}
                                                    <br/> {/* Add line break after each line */}
                                                </span>
                                            ))}
                                            pricing={service.pricing}
                                            duration={formatDuration(duration)} // Set the duration of the service and format it
                                            onAppointmentBookConfirm={() => handleAppointmentBookConfirm(service)} // Pass data to the payment page
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
