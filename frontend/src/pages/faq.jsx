import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icon for expanding the accordion

const FAQ = () => {
    return (
        <>
            <Typography variant="h3" gutterBottom align="center">
                Frequently Asked Questions
            </Typography>

            <Grid container direction="column" alignItems="center" spacing={4}>

                {/* Accordion for FAQ Item 1 */}
                <Grid item xs={12} style={{ maxWidth: '1000px', width: '100%' }}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h4" align="center">
                                How can I book an appointment?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography align="center">
                                Booking an appointment is best done over the phone at{' '}
                                <a href="tel:+19169182969">(916) 918-2969</a> or by clicking the 'book appointment' tab above.
                                We can also be reached through the email chat function on our website, by emailing{' '}
                                <a href="mailto:retreatroseville@gmail.com">retreatroseville@gmail.com</a>, or through Facebook Messenger.
                                Our front desk staff will reach out to you at our earliest convenience to book your appointment.
                                We do require a credit card or a gift card number on file to book an appointment.
                                This card will NOT be charged; it is only used to enforce our cancellation policy (see below).
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* Accordion for FAQ Item 2 */}
                <Grid item xs={12} style={{ maxWidth: '1000px', width: '100%' }}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h4" align="center">
                                What time should I arrive?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography align="center">
                                Arrive 15-30 minutes early in order to get comfortable and fill out paperwork, giving us a chance
                                to get to know your medical history, injuries, or concerns you may have. If you are late for your scheduled appointment,
                                we will do our best to accommodate your full booking. If we are unable to do so, your appointment will end on time and the full 
                                amount of service will apply.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* Accordion for FAQ Item 3 */}
                <Grid item xs={12} style={{ maxWidth: '1000px', width: '100%' }}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h4" align="center">
                                What should I expect?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography align="center">
                                • Disconnect Digitally - For the optimal and most relaxing experience, we ask that you silence your phones and 
                                disconnect digitally in order to enjoy your treatment to the fullest. In addition, please enjoy quiet 
                                conversations to help maintain a tranquil environment for all guests.<br />
                                • During your service - Massage and facial services allot for up to 10 minutes of consultation, dressing, and 
                                60 to 90 minutes of hands-on service.<br />
                                • Communication - It is our goal to customize all services to meet your needs. That being said, it is your 
                                responsibility to communicate to your technician areas of concern, focus, or make clear that you would just like 
                                to relax. Talk to us as little or as much as you would like, providing feedback as necessary. Your comfort is what 
                                matters most.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* Accordion for FAQ Item 4 */}
                <Grid item xs={12} style={{ maxWidth: '1000px', width: '100%' }}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h4" align="center">
                                What if I have to cancel?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography align="center">
                                For Single or Double appointments, there will be no charge for cancellations made more than 48 hours before your 
                                scheduled appointment time. For cancellations made within 48 hours of appointment time, we ask for 50% of the 
                                scheduled service(s) price. In the event of a cancellation within 1 hour of your appointment or a no-show, 
                                100% of your service(s) will be charged.<br /><br />
                                We would love to host your group for your next party or special event! For bookings of 3 or more, we require a 
                                7-day notice for cancellation. If we receive a cancellation less than 7 days before the appointment time, 50% of 
                                the service(s) will be charged. In the event of a cancellation within 24 hours, 100% of the service(s) will be 
                                charged.<br /><br />
                                We are sympathetic and understand things come up in life, but we cannot absorb the financial responsibility of 
                                cancellations. When you forget your appointment or cancel without giving enough notice, we don’t have the 
                                opportunity to fill that appointment time, and we are still responsible for paying the therapist you were 
                                scheduled with. Thanks for understanding.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

                {/* Accordion for FAQ Item 5 */}
                <Grid item xs={12} style={{ maxWidth: '1000px', width: '100%' }}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h4" align="center">
                                What are your hours?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography align="center">
                                Monday: CLOSED<br />
                                Tuesday-Wednesday: 10 AM - 6 PM<br />
                                Thursday: 10 AM - 7 PM<br />
                                Friday & Saturday: 10 AM - 6 PM<br />
                                Sunday: 11 AM - 5 PM
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Grid>

            </Grid>
        </>
    );
};

export default FAQ;
