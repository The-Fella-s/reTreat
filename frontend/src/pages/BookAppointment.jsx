import React, {useState} from 'react';
import {Typography, Grid2, Button, Box} from '@mui/material';

const categories = ['Body Treatments', 'Facials', 'Nanochanneling Facials', 'Hydrafacials', 'Dermaplaning', 'Nail Care', 'Massages', 'Waxing', 'Add-Ons'];

const BookAppointment = () => {

    const [selectedCategory, setSelectedCategory] = useState('Body Treatments');

    return (

        // Centers the whole page
        <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Turns the title and category into a column */}
            <Box>

                {/* Title */}
                <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold' }}  xs={12} sm={6} md={4} p={5}>
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
                </Box>

            </Box>
        </Box>
    );
}

export default BookAppointment;
