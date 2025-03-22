import * as React from 'react';
import Card from '@mui/material/Card';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const TotalPaymentCard = ({ title, pricing, appointmentTime }) => {
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Card sx={{ width: 300, height: '100%' }}>
            <Box
                sx={{
                    height: 216,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 6,
                    textOverflow: 'ellipsis',
                }}
            >
                <CardContent>
                    <Typography gutterBottom variant="h7" component="div" sx={{ fontWeight: 'bold' }}>
                        Total Payment
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {title}
                    </Typography>
                    {appointmentTime && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            Appointment: {appointmentTime.date} at {appointmentTime.time}
                        </Typography>
                    )}
                    <Typography>${pricing}</Typography>
                </CardContent>
            </Box>
            <CardActions sx={{ justifyContent: 'flex-end', display: 'flex' }}>
                <Button variant="outlined" size="small" fullWidth onClick={handleOpenDialog}>
                    Read more
                </Button>
            </CardActions>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Total Payment</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {title}
                    </Typography>
                    {appointmentTime && (
                        <Typography variant="body1">
                            Appointment: {appointmentTime.date} at {appointmentTime.time}
                        </Typography>
                    )}
                    <Typography variant="body1">${pricing}</Typography>
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

TotalPaymentCard.propTypes = {
    title: PropTypes.string.isRequired,
    pricing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    appointmentTime: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
    }),
};

export default TotalPaymentCard;
