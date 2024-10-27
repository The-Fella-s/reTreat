import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import StockImage from '../assets/StockImage.jpg';
import PropTypes from 'prop-types';

const AppointmentCard = ({ title, description, pricing, duration }) => {
    const [openDialog, setOpenDialog] = React.useState(false);

    // Function to handle opening the dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    // Function to handle closing the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        // Card component that has a fixed width and height
        <Card sx={{ width: 350, height: 400 }}>
            {/* Image with a fixed height */}
            <CardMedia
                sx={{ height: 140 }}
                image={StockImage}
            />

            {/* Box component that has a fixed height for the title and description */}
            <Box
                sx={{
                    height: 150,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 6, // Limit to 6 lines
                    textOverflow: 'ellipsis', // Show ellipsis for overflowing text
                }}
            >
                <CardContent>
                    {/* Title */}
                    <Typography gutterBottom variant="h7" component="div" sx={{ fontWeight: "bold" }}>
                        {title}
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </Box>

            {/* Padding between description and buttons */}
            <Box sx={{ p: 1 }}></Box>

            {/* Read More button that opens up a popup and shows the full information */}
            <CardActions sx={{
                justifyContent: "flex-end",
                display: "flex",
            }}>
                <Button variant="outlined" size="small" fullWidth onClick={handleOpenDialog}>Read more</Button>
            </CardActions>

            {/* Center the buttons evenly with space between */}
            <CardActions sx={{
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Button size="small">${pricing}</Button>
                <Button size="small">{duration}</Button>
                <Button variant="outlined" size="small">Book</Button>
            </CardActions>

            {/* Dialog popup for "Read more" content */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">{description}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
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
