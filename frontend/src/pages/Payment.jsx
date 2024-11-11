import { useLocation } from 'react-router-dom';
import AppointmentCardDetailsOnly from '../components/AppointmentCardDetailsOnly.jsx';
import { Box, Grid2 } from '@mui/material';
import TotalPaymentCard from '../components/TotalPaymentCard.jsx';
import CalendarAndAvailableHours from '../components/CalendarAndAvailableHours.jsx';

const Payment = () => {
    const { state } = useLocation();
    // Destructure the appointment data from the state object
    const { appointmentData } = state || {};

    if (!appointmentData) {
        return <div>No appointment data found!</div>;
    }

    return (
        <>
            <Grid2
                container
                direction='row'
                paddingTop={4}
                paddingBottom={4}
                paddingLeft={4}
                spacing={4}
                justifyContent={{ xs: 'center', md: 'flex-start' }} // Center on mobile, align left on desktop
                alignItems={{ xs: 'center', md: 'flex-start' }} // Align center vertically on mobile, align center left on desktop
                sx={{
                    height: 'auto', // Dynamic height to adjust to content
                }}
            >
                {/* Appointment details card */}
                <Grid2
                    item
                    xs={12}
                    md={6}>
                    <AppointmentCardDetailsOnly
                        title={appointmentData.name}
                        description={appointmentData.description}
                        pricing={appointmentData.pricing}
                        duration={appointmentData.duration}
                        sx={{ height: 'auto' }}
                    />
                </Grid2>

                <Box
                    component='img'
                    sx={{
                        height: { xs: 'auto', md: '270px', lg: '270px' }, // Auto height on mobile, fixed height on desktop
                        minWidth: { xs: 'auto', md: '30%' }, // Minimum width on desktop
                        maxWidth: { xs: 'auto', md: '300px', lg: '60%' }, // Maximum width from desktop to large screens
                        width: '100%', // Full width on all screen sizes
                        display: { xs: 'none', md: 'block' }, // Hidden on mobile, visible on desktop and up
                        gridColumn: { xs: 'span 0', md: 'span 6' }, // Does not occupy grid space on mobile
                    }}
                    alt='Appointment picture'
                    src='https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2'
                />

                {/* Total Payment Card - sticky on desktop for visibility during scrolling */}
                <Grid2
                    item
                    xs={12}
                    md={6}
                    sx={{
                        position: 'sticky', // Sticky position for fixed visibility
                        top: 20, // Offset from the top
                        order: { xs: 2, md: 1 }, // Renders below DateTimePicker on mobile, but above it on desktop
                        zIndex: 10, // Ensure visibility above other components
                    }}
                >
                    <TotalPaymentCard
                        title={appointmentData.name} // Display appointment name in payment card
                        pricing={appointmentData.pricing} // Display appointment pricing in payment card
                    />
                </Grid2>

                {/* Ensure DateTimePicker is always below AppointmentCardDetailsOnly */}
                <Grid2 item xs={12} sx={{ order: { xs: 1, md: 2 } }}>
                    <CalendarAndAvailableHours />
                </Grid2>
            </Grid2>
        </>
    );
};

export default Payment;
