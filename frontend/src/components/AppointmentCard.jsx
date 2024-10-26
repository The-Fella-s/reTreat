import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Box, CardMedia} from '@mui/material';
import StockImage from '../assets/StockImage.jpg';
import PropTypes from "prop-types";

const AppointmentCard = ({ title, description, pricing, duration }) => {
    return (
        // Card component that has a fixed width and height
        <Card sx={{ width: 340, height: 400 }}>

            {/* Image with a fixed height */}
            <CardMedia
                sx={{ height: 140 }}
                image={StockImage}
            />

            {/* Box component that has a fixed height
                for the title and description */}
            <Box
                sx={{
                    height: 200
                }}
            >
                <CardContent>
                    {/* Title */}
                    <Typography gutterBottom variant="h6" component="div">
                        {title}
                    </Typography>

                    {/* Description */}
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {description}
                    </Typography>
                </CardContent>
            </Box>

            {/* Center the buttons evenly with space between */}
            <CardActions sx={{
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Button size="small">${pricing}</Button>
                <Button size="small">{duration}</Button>
                <Button variant="outlined" size="small">Book</Button>
            </CardActions>

        </Card>
    );
}

// PropTypes for the AppointmentCard component
AppointmentCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    pricing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    duration: PropTypes.string.isRequired,
};

export default AppointmentCard;
