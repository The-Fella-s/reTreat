import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, TextField } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icon for expanding the accordion

const FAQ = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const faqItems = [
        {
            question: "How can I book an appointment?",
            answer: (
                <>
                  Booking an appointment is best done over the phone at{' '}
                  <a href="tel:+19169182969">(916) 918-2969</a> or by clicking the 'book appointment' tab above.
                  We can also be reached through the email chat function on our website, by emailing{' '}
                  <a href="mailto:retreatroseville@gmail.com">retreatroseville@gmail.com</a>, or through Facebook Messenger.
                  Our front desk staff will reach out to you at our earliest convenience to book your appointment. We do require a credit card or a gift card number on file to book an appointment.
                  This card will NOT be charged; it is only used to enforce our cancellation policy (see below).
                </>
              )
        },
        {
            question: "What time should I arrive?",
            answer: `Arrive 15-30 minutes early in order to get comfortable and fill out paperwork, giving us a chance
            to get to know your medical history, injuries, or concerns you may have. If you are late for your scheduled appointment,
            we will do our best to accommodate your full booking. If we are unable to do so, your appointment will end on time and the full 
            amount of service will apply.`
        },
        {
            question: "What should I expect?",
            answer: (
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', textAlign: 'left' }}>
                  <li>Disconnect Digitally - For the optimal and most relaxing experience, we ask that you silence your phones and disconnect digitally in order to enjoy your treatment to the fullest. In addition, please enjoy quiet conversations to help maintain a tranquil environment for all guests.</li>
                  <li>During your service - Massage and facial services allot for up to 10 minutes of consultation, dressing, and 60 to 90 minutes of hands-on service.</li>
                  <li>Communication - It is our goal to customize all services to meet your needs. That being said, it is your responsibility to communicate to your technician areas of concern, focus, or make clear that you would just like to relax. Talk to us as little or as much as you would like, providing feedback as necessary. Your comfort is what matters most.</li>
                </ul>
              )
        },
        {
            question: "What if I have to cancel?",
            answer: (
                <>
                  <Typography align="center">
                    For Single or Double appointments there will be no charge for cancellations made more than 48 hours before your scheduled appointment time. 
                    For cancellations made within 48 hours of appointment time we ask for 50% of the scheduled service(s) price. 
                    In the event of a cancellation within 1 hour of your appointment or a no-show, 100% of your service(s) will be charged.
                  </Typography>
                  <br />
                  <Typography align="center">
                    We would love to host your group for your next party or special event! For bookings of 3 or more, we require a 7-day notice for cancellation. 
                    If we receive a cancellation less than 7 days before the appointment time, 50% of the service(s) will be charged. 
                    In the event of a cancellation within 24 hours, 100% of the service(s) will be charged.
                  </Typography>
                  <br />
                  <Typography align="center">
                    We are sympathetic and understand things come up in life, but we cannot absorb the financial responsibility of cancellations. 
                    When you forget your appointment or cancel without giving enough notice, we don’t have the opportunity to fill that appointment time, 
                    and we are still responsible for paying the therapist you were scheduled with. Thanks for understanding.
                  </Typography>
                </>
              )
        },
        {
            question: "What are your hours?",
            answer: (
                <ul style={{ listStyleType: 'none', paddingLeft: '0px', textAlign: 'left' }}>
                  <li>Monday: CLOSED</li>
                  <li>Tuesday-Wednesday: 10 AM - 6 PM</li>
                  <li>Thursday: 10 AM - 7 PM</li>
                  <li>Friday & Saturday: 10 AM - 6 PM</li>
                  <li>Sunday: 11 AM - 5 PM</li>
                </ul>
              )
        }
    ];

    // Allows searching within the descriptions
    const getTextFromAnswer = (answer) => {
        return typeof answer === 'string' ? answer : answer.props.children.join('');
    };

    // Filtered FAQ items based on search query (for both question and answer)
    const filteredFAQItems = faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getTextFromAnswer(item.answer).toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <>
            <Typography variant="h3" gutterBottom align="center" sx = {{fontFamily: "Special Elite"}}>
                Frequently Asked Questions
            </Typography>

             {/* Search Bar */}
             <Grid container justifyContent="center" style={{ marginBottom: '20px' }}>
                <TextField 
                    label="Search FAQs" 
                    variant="outlined" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    style={{ width: '1000px', maxWidth: '100%' }}
                />
            </Grid>

            <Grid container direction="column" alignItems="center" spacing={4}>
                {filteredFAQItems.length > 0 ? (
                    filteredFAQItems.map((item, index) => (
                        <Grid item xs={12} style={{ maxWidth: '1000px', width: '100%' }} key={index}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h4" align="center">
                                        {item.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography align="center">
                                        {item.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" align="center">
                        No FAQs found.
                    </Typography>
                )}
            </Grid>
        </>
    );
};

export default FAQ;
