import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import StockImage from '../assets/StockImage.jpg';
import PropTypes from 'prop-types';

const AppointmentCard = ({ title, description, pricing, duration, image, onAppointmentBookConfirm }) => {
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleClick = () => {
        console.log(title, description, pricing, duration);
        onAppointmentBookConfirm({ title, description, pricing, duration });
    };

    // Use the passed image or fall back to the stock image.
    const imageUrl = image || StockImage;

    return (
        // Card component that has a fixed width and height
        <Card sx={{ width: 350, height: 400 }}>
            {/* Image with a fixed height */}
            <CardMedia
                sx={{ height: 140 }}
                image={imageUrl}
            />
            <Box sx={{ height: 150 }}>
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
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 4,
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </Box>

            {/* Padding between description and buttons */}
            <Box sx={{ p: 1 }}></Box>
            <CardActions sx={{ justifyContent: "flex-end", display: "flex" }}>
                <Button variant="outlined" size="small" fullWidth onClick={handleOpenDialog}>Read more</Button>
            </CardActions>
            <CardActions sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Button size="small">${pricing}</Button>
                <Button size="small">{duration}</Button>
                <Button variant="outlined" size="small" onClick={handleClick}>Book</Button>
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
};

// PropTypes for the AppointmentCard component
AppointmentCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    pricing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    duration: PropTypes.string.isRequired,
    image: PropTypes.string, // New image prop
    onAppointmentBookConfirm: PropTypes.func.isRequired,
};

export default AppointmentCard;
