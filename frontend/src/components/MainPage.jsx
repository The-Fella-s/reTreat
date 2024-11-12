import React from 'react';
import { Box, Button, Container, Grid2, Typography, Card, CardContent, autocompleteClasses } from '@mui/material';
import img from '/src/assets/StockImage.jpg';

function MainPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4, color: 'primary.main' }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to reTreat Salon & Spa
                </Typography>
                <Typography variant="h5" color="text.primary" sx={{ mb: 2 }}>
                    Experience reTreat — a place to pause, exhale, and renew
                </Typography>
                <Typography variant = "h5" color = "gray" sx={{ mb: 0 }}>
                    Meet the Owners of reTreat Salon & Spa
                </Typography>
                <Typography variant = "h4" color = "Gray" sx={{ mb: 0 }}>
                    Danniel & Holly
                </Typography>
                <Box 
                    component = "img"
                    src = {img}
                    alt = "Danniel&Holly"
                    sx = {{
                        mb: 2,
                        width: '100%',
                        maxWidth: 400,
                        height: 'auto',
                        mt: 2,
                        borderRadius: 6,
                        border: 6,
                        borderColor: 'gray'
                    }}
                />
                <Typography variant = 'h3' color = "gray" sx = {{mb: 2}}>
                    Our mission and values
                </Typography>
            </Box>
        </Container>
    );
}

export default MainPage;
