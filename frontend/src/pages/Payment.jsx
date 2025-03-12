import { data, useLocation } from 'react-router-dom';
import AppointmentCardDetailsOnly from '../components/AppointmentCardDetailsOnly.jsx';
import AppointmentCard from '../components/AppointmentCard.jsx';
import {Box, Grid2} from '@mui/material';
import TotalPaymentCard from '../components/TotalPaymentCard.jsx';
import CalendarAndAvailableHours from '../components/CalendarAndAvailableHours.jsx';
import PaymentInformation from "../components/PaymentInformation.jsx";
import { CartProvider } from '../context/CartContext.jsx';

const Payment = () => {
    const { state } = useLocation();
    const { appointmentData } = state || {};

    if (!appointmentData) {
        return <div>No appointment data found!</div>;
    }

    return (
        <>
            <Grid2
                container
                justifyContent='center'
                alignItems='center'
            >
                <Grid2
                    container
                    direction='row'
                    paddingX={{ xs: 2, md: 4 }} // Padding on both left and right sides
                    paddingY={4} // Padding for top and bottom
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
                            onAppointmentBookConfirm={(data) => console.log(data)}
                            sx={{ height: 'auto' }}
                        />
                    </Grid2>

                    <Box
                        component='img'
                        sx={{
                            height: { xs: 'auto', md: '270px', xl: '270px' }, // Auto height on mobile, fixed height on desktop
                            minWidth: { xs: '20%', md: '37.5%' }, // Makes it responsive on mobile, laptops and desktop
                            maxWidth: { xs: 'auto', md: '37.5%', lg: '40%', xl: '63.5%' }, // Makes it responsive on mobile, laptops and desktop
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

                    {/* Calendar and Available Hours */}
                    <Grid2 item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
                        <CalendarAndAvailableHours />
                    </Grid2>

                    <Box
                        sx={{
                            height: { xs: 'auto', md: '100%', lg: '100%' }, // Auto height on mobile, fixed height on desktop
                            minWidth: { xs: '300px', md: '37.5%' }, // Makes it responsive on mobile, laptops and desktop
                            maxWidth: { xs: '300px', md: '37.5%', lg: '40%', xl: '63.5%' }, // Makes it responsive on mobile, laptops and desktop
                            width: '100%', // Full width on all screen sizes
                            gridColumn: { xs: 'span 0', md: 'span 6' }, // Does not occupy grid space on mobile
                            order: { xs: 1, md: 2 },
                        }}
                    >
                    <CartProvider>
                        <PaymentInformation/>
                    </CartProvider>
                    </Box>

                </Grid2>
            </Grid2>

        </>
    );
};

export default Payment;
