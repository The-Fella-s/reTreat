import * as React from 'react';
import Card from '@mui/material/Card';
import {Box, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const TotalPaymentCard = ({ title, pricing }) => {
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
        <Card
            sx={{
                width: 300,
                height: '100%'
            }}>
            {/* Box component that has a fixed height for the title and description */}
            <Box
                sx={{
                    height: 216,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 6, // Limit to 6 lines
                    textOverflow: 'ellipsis', // Show ellipsis for overflowing text
                }}
            >
                <CardContent>
                    {/* Title */}
                    <Typography gutterBottom variant='h7' component='div' sx={{ fontWeight: 'bold' }}>
                        Total Payment
                    </Typography>

                    {/* Description */}
                    <Typography variant='body2' sx={{ color: 'text.secondary', }}>
                        {title}
                    </Typography>

                    {/* Pricing */}
                    <Typography>
                        ${pricing}
                    </Typography>
                </CardContent>
            </Box>

            {/* Read more button to open a popup */}
            <CardActions sx={{ justifyContent: 'flex-end', display: 'flex' }}>
                <Button variant='outlined' size='small' fullWidth onClick={handleOpenDialog}>
                    Read more
                </Button>
            </CardActions>

            {/*
            Dialog popup for 'Read more' content
            Will show everything soon, including menu stuff
            For now, it only shows appointment and pricing
            */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Total Payment</DialogTitle>
                <DialogContent>
                    <Typography
                        variant='body1'
                        sx={{
                            color: 'text.secondary',
                        }}
                    >{title}</Typography>
                    <Typography variant='body1'>${pricing}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}

// Props for appointment title and pricing
TotalPaymentCard.propTypes = {
    title: PropTypes.string.isRequired,
    pricing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TotalPaymentCard;
