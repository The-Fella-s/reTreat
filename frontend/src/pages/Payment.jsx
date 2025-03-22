import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppointmentCardDetailsOnly from '../components/AppointmentCardDetailsOnly.jsx';
import AppointmentCard from '../components/AppointmentCard.jsx';
import { Box, Grid2 } from '@mui/material';
import TotalPaymentCard from '../components/TotalPaymentCard.jsx';
import CalendarAndAvailableHours from '../components/CalendarAndAvailableHours.jsx';
import PaymentInformation from '../components/PaymentInformation.jsx';
import { CartProvider } from '../context/CartContext.jsx';

const Payment = () => {
    const { state } = useLocation();
    const { appointmentData } = state || {};

    // State to hold the selected appointment slot (an object with date and time)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    if (!appointmentData) {
        return <div>No appointment data found!</div>;
    }

    return (
        <>
            <Grid2 container justifyContent="center" alignItems="center">
                <Grid2
                    container
                    direction="row"
                    paddingX={{ xs: 2, md: 4 }}
                    paddingY={4}
                    spacing={4}
                    justifyContent={{ xs: 'center', md: 'flex-start' }}
                    alignItems={{ xs: 'center', md: 'flex-start' }}
                    sx={{ height: 'auto' }}
                >
                    {/* Appointment details card */}
                    <Grid2 item xs={12} md={6}>
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
                        component="img"
                        sx={{
                            height: { xs: 'auto', md: '270px', xl: '270px' },
                            minWidth: { xs: '20%', md: '37.5%' },
                            maxWidth: { xs: 'auto', md: '37.5%', lg: '40%', xl: '63.5%' },
                            width: '100%',
                            display: { xs: 'none', md: 'block' },
                            gridColumn: { xs: 'span 0', md: 'span 6' },
                        }}
                        alt="Appointment picture"
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
                    />

                    {/* Total Payment Card - sticky on desktop */}
                    <Grid2
                        item
                        xs={12}
                        md={6}
                        sx={{
                            position: 'sticky',
                            top: 20,
                            order: { xs: 2, md: 1 },
                            zIndex: 10,
                        }}
                    >
                        <TotalPaymentCard
                            title={appointmentData.name}
                            pricing={appointmentData.pricing}
                            appointmentTime={selectedTimeSlot}  // Pass the selected appointment slot here
                        />
                    </Grid2>

                    {/* Calendar and Available Hours */}
                    <Grid2 item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
                        <CalendarAndAvailableHours onTimeSlotSelect={setSelectedTimeSlot} />
                    </Grid2>

                    <Box
                        sx={{
                            height: { xs: 'auto', md: '100%', lg: '100%' },
                            minWidth: { xs: '300px', md: '37.5%' },
                            maxWidth: { xs: '300px', md: '37.5%', lg: '40%', xl: '63.5%' },
                            width: '100%',
                            gridColumn: { xs: 'span 0', md: 'span 6' },
                            order: { xs: 1, md: 2 },
                        }}
                    >
                        <CartProvider>
                            <PaymentInformation />
                        </CartProvider>
                    </Box>

                </Grid2>
            </Grid2>
        </>
    );
};

export default Payment;
