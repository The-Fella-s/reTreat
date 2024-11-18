import React from 'react';
import { Box, Container, Grid2, Typography} from '@mui/material'; // Might change things utilizing Grid2 later on, leaving here for now
import img from '/src/assets/StockImage.jpg';

function MainPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4, color: 'primary.main',  }}>
                <Typography variant="h2" component="h1" gutterBottom sx = {{fontFamily: "Special Elite"}}>
                    Welcome to reTreat Salon & Spa
                </Typography>
                <Typography variant="h5" color="text.primary" sx={{ fontFamily: "Special Elite", mb: 2 }}>
                    Experience reTreat — a place to pause, exhale, and renew
                </Typography>
                <Typography variant = "h5" color = "gray" sx={{ fontFamily: "Special Elite", mb: 0 }}>
                    Meet the Owners of reTreat Salon & Spa
                </Typography>
                <Typography variant = "h4" color = "Gray" sx={{ fontFamily: "Special Elite", mb: 0 }}>
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
                <Typography variant = 'h3' color = "gray" sx = {{fontFamily: "Special Elite", mb: 2}}>
                    Our mission and values
                </Typography>
                <Typography variant = 'h6' color = "black" sx = {{mb: 2}}>
                Our Passion is Prioritizing Self Care!! Our team is dedicated to providing  consistent high standards, with a beautiful customer-focused experience.
                We will always perform with the highest integrity. 
                </Typography>
                <Typography variant = 'h3' color = "gray" sx = {{fontFamily: "Special Elite", mb: 2}}>
                    About reTreat
                </Typography>
                <Typography variant = 'h6' color = "black" sx = {{mb: 2}}>
                Welcome to reTreat! Our top priority is to help you reLax and reJuvenate. 
                Our spa is designed to provide a peaceful and tranquil environment, 
                where you can escape from the stresses of everyday life and 
                indulge in a variety of treatments that will leave you feeling reFreshed and reNewed.
                </Typography>

                <Typography variant = 'h6' color = "black" sx = {{mb: 2}}>
                We are a full-service Salon & Spa offering massages, facials, body treatments, natural nail services, waxing, teeth whitening, reiki, and salon services. 
                You are going to feel right at home in our comfortable space and our amazing team will treat or reTreat you from your everyday life stresses!  
                Our trained and experienced therapists will work with you to customize services to meet your specific needs, ensuring that you receive the utmost care and attention during your time with us. 
                For the perfect cherry on top don’t forget to visit our reLaxation Lounge during your stay!
                </Typography>
                <Typography variant = 'h6' color = "black" sx = {{mb: 2}}>
                You can find a wide variety of massage styles on our menu including swedish, deep tissue, prenatal, and custom muscle work to list a few. 
                You can always easily upgrade your experience by adding hot stones, aromatherapy, or CBD oil to your massage.
                </Typography>
                <Typography variant = 'h6' color = "black" sx = {{mb: 2}}>
                We proudly use Lira Clinical’s skincare line for our facials, utilizing the highest quality and the most technologically advanced ingredients to deliver superior skin care results. 
                Using unique formulas with topical probiotics, multiple plant stem cells, advanced peptides, exclusive botanicals, and various skin-nourishing vitamins and minerals, 
                which will leave your skin looking soft, smooth, younger, and radiant.
                </Typography>
                <Typography variant = 'h6' color = "black" sx = {{mb: 2}}>
                reTreat yourself to a Blissful Body Treatment using Lira Clinical’s scrub, firming cream, body oil, and moisturizer. 
                This luxury service will detoxify, hydrate, and nourish your skin. 
                Ever felt like you just wanted to stay right where you are after a massage? With our decadent body treatments - you can! 
                This service concludes with a warm eye mask, earplugs, and a cacoon wrap! Absolute bliss!
                </Typography>
                <Typography variant = 'h6' color = "black" sx = {{mb: 2}}>
                Our waxing services are done with the utmost sanitary procedures (no double dipping here!) to provide you with the peace of mind you deserve. 
                Our highly trained Estheticians will provide comfort and ease during your service.
                </Typography>
                <Typography variant = 'h6' color = "black" sx = {{mb: 2}}>
                Pick from reTreat, deLuxe, or luXury manicures and pedicures with your choice of regular or gel polish in a wide variety of colors, perfect for any mood or season! 
                We pride ourselves in maintaining a clean and comfortable space for you to enjoy.
                </Typography>
                <Typography variant = 'h6' color = "black" sx = {{mb: 2}}>
                At reTreat, we believe that wellness is not just about physical health, but also mental and emotional well-being. 
                We aim to help you achieve balance and harmony in your life, so you can look and feel your best inside and out.  
                We look forward to pampering you soon!
                </Typography>
            </Box>
        </Container>
    );
}

export default MainPage;
