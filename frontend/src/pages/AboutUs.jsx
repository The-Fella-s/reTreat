import React from 'react';
import { Box, Container, Typography} from '@mui/material'; // Might change things utilizing Grid2 later on, leaving here for now
import img from '/src/assets/Danniel&Holly.jpg';
import ReadyToRelax from '../components/ReadyToRelax';

function AboutUs() {
    return (
        <Box>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{textAlign: 'center', mb: 4, color: 'primary.main',}}>
                <Typography variant="h2" gutterBottom sx={{}}>
                    Our Story at reTreat Salon & Spa
                    <Typography variant="h5" color="text.primary">
                    A place born from passion, care, and the belief that everyone deserves a space to pause, exhale, and renew.
                    </Typography>
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{mb: 0}}>
                    Meet the Owners of reTreat Salon & Spa
                    <Typography variant="h4" color="text.secondary" sx={{mb: 0}}>
                        Danniel & Holly
                    </Typography>
                    <Box
                        component="img"
                        src={img}
                        alt="Danniel&Holly"
                        sx={{
                            mb: 2,
                            width: '100%',
                            maxWidth: 400,
                            height: 'auto',
                            mt: 2,
                            borderRadius: 6,
                            border: 4,
                            borderColor: 'text.secondary'
                        }}
                    />
                </Typography>
                <Typography variant='h3' color="text.secondary" sx={{mb: 2}}>
                    Our mission and values
                    <Typography variant='h6' color="text.primary" sx={{mb: 2}}>
                        Our Passion is Prioritizing Self Care!! Our team is dedicated to providing consistent high
                        standards, with a beautiful customer-focused experience.
                        We will always perform with the highest integrity.
                    </Typography>
                </Typography>
                <Typography variant='h3' color="text.secondary" sx={{mb: 2}}>
                    About reTreat
                    <Typography variant='h6' color="text.primary" sx={{mb: 2}}>
                        Welcome to reTreat! Our top priority is to help you reLax and reJuvenate.
                        Our spa is designed to provide a peaceful and tranquil environment,
                        where you can escape from the stresses of everyday life and
                        indulge in a variety of treatments that will leave you feeling reFreshed and reNewed.
                        <br/>
                        <br/>
                        We are a full-service Salon & Spa offering massages, facials, body treatments, natural nail
                        services, waxing, teeth whitening, reiki, and salon services.
                        You are going to feel right at home in our comfortable space and our amazing team will treat or
                        reTreat you from your everyday life stresses!
                        Our trained and experienced therapists will work with you to customize services to meet your
                        specific needs, ensuring that you receive the utmost care and attention during your time with
                        us.
                        For the perfect cherry on top don’t forget to visit our reLaxation Lounge during your stay!
                        <br/>
                        <br/>
                        You can find a wide variety of massage styles on our menu including swedish, deep tissue,
                        prenatal, and custom muscle work to list a few. You can always easily upgrade your experience by
                        adding hot stones, aromatherapy, or CBD oil to
                        your massage.
                        <br/>
                        <br/>
                        We proudly use Lira Clinical’s skincare line for our facials, utilizing the highest quality and
                        the most
                        technologically advanced ingredients to deliver superior skin care results.
                        Using unique formulas with topical probiotics, multiple plant stem cells, advanced peptides,
                        exclusive
                        botanicals, and various skin-nourishing vitamins and minerals,
                        which will leave your skin looking soft, smooth, younger, and radiant.
                        <br/>
                        <br/>
                        reTreat yourself to a Blissful Body Treatment using Lira Clinical’s scrub, firming cream, body
                        oil, and
                        moisturizer.
                        This luxury service will detoxify, hydrate, and nourish your skin.
                        Ever felt like you just wanted to stay right where you are after a massage? With our decadent
                        body
                        treatments - you can!
                        This service concludes with a warm eye mask, earplugs, and a cacoon wrap! Absolute bliss!
                        <br/>
                        <br/>
                        Our waxing services are done with the utmost sanitary procedures (no double dipping here!) to
                        provide
                        you with the peace of mind you deserve.
                        Our highly trained Estheticians will provide comfort and ease during your service.
                        <br/>
                        <br/>
                        Pick from reTreat, deLuxe, or luXury manicures and pedicures with your choice of regular or gel
                        polish in a wide variety of colors, perfect for any mood or season!
                        We pride ourselves in maintaining a clean and comfortable space for you to enjoy.
                        <br/>
                        <br/>
                        At reTreat, we believe that wellness is not just about physical health, but also mental and
                        emotional well-being.
                        We aim to help you achieve balance and harmony in your life, so you can look and feel your best
                        inside and out.
                        We look forward to pampering you soon!
                    </Typography>
                </Typography>
            </Box>


        </Container>
			<ReadyToRelax />
        </Box>
        

    );
}

export default AboutUs;
