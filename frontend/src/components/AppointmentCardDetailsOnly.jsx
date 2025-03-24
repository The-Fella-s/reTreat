import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, CardMedia } from '@mui/material';
import PropTypes from 'prop-types';

const AppointmentCardDetailsOnly = ({ title, description, image }) => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    // Check for mobile size
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 600px)');
        const handleResize = (e) => setIsMobile(e.matches); // Update state based on screen size

        // Set the initial value of `isMobile` based on current screen size
        setIsMobile(mediaQuery.matches);

        // Add event listener for screen size changes
        mediaQuery.addEventListener('change', handleResize);

        // Cleanup listener on component unmount
        return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Card sx={{ width: 300, height: '100%' }}>
            {/* Render CardMedia (image) only on mobile screens */}
            {isMobile && (
                <CardMedia
                    component="img"
                    height="140"
                    image={image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"}
                    alt="Mobile-only image"
                />
            )}

            {/* Box component to limit the text content height */}
            <Box
                sx={{
                    height: 200, // Fixed height for text content box
                    display: '-webkit-box', // Use webkit box for text truncation
                    overflow: 'hidden', // Hide overflow content
                    WebkitBoxOrient: 'vertical', // Vertical orientation for box
                    WebkitLineClamp: 6, // Limit to 6 lines
                    textOverflow: 'ellipsis', // Add ellipsis for overflow text
                }}
            >
                <CardContent>
                    {/* Title */}
                    <Typography gutterBottom variant='h7' component='div' sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>

                    {/* Description with additional styling */}
                    <Typography
                        variant='body2'
                        sx={{
                            color: 'text.secondary',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 5,
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </Box>

            {/* Padding between description and buttons */}
            <Box sx={{ p: 1 }} />

            {/* Read More button that opens up a popup and shows the full information */}
            <CardActions sx={{ justifyContent: 'flex-end', display: 'flex' }}>
                <Button variant='outlined' size='small' fullWidth onClick={handleOpenDialog}>
                    Read more
                </Button>
            </CardActions>

            {/* Dialog popup for 'Read more' content */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Typography variant='body1'>{description}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

// PropTypes for the AppointmentCardDetailsOnly component
AppointmentCardDetailsOnly.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.array,
    pricing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    duration: PropTypes.string.isRequired,
    image: PropTypes.string
};

export default AppointmentCardDetailsOnly;
