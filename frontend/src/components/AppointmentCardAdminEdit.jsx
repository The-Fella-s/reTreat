import React, { useState } from 'react';
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import PropTypes from 'prop-types';

const AppointmentCardAdminEdit = ({ title, description, pricing, image, duration, category, onDelete, onEdit }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
        }
        setOpenDeleteDialog(false);
    };

    const handleEdit = () => {
        if (onEdit) {
            // Pass all current props as the service data
            onEdit({ title, description, pricing, image, duration, category });
        }
    };

    // Determine the image to display. If a custom image object exists, use its preview.
    const imageUrl =
        typeof image === 'object' && image.preview
            ? image.preview
            : image ||
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2';

    return (
        <>
            <Card sx={{ width: 290, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" height="140" image={imageUrl} alt={title} />

                <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Typography
                        variant="h7"
                        component="div"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            overflow: 'hidden',
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        component="div"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            overflow: 'hidden',
                        }}
                    >
                        {category}
                    </Typography>
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
                            WebkitLineClamp: 6,
                        }}
                    >
                        {description}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                        <Typography variant="h7" component="div">
                            {duration}
                        </Typography>
                        <Typography variant="h7" component="div">
                            ${pricing}
                        </Typography>
                    </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                    {onEdit && (
                        <Button variant="outlined" size="small" onClick={handleEdit} color="primary">
                            Edit
                        </Button>
                    )}
                    <Button variant="outlined" size="small" onClick={handleOpenDialog}>
                        Read more
                    </Button>
                    {onDelete && (
                        <Button variant="outlined" size="small" onClick={handleOpenDeleteDialog} color="error">
                            Delete
                        </Button>
                    )}
                </CardActions>
            </Card>

            {/* Details Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {description}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to delete this appointment?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

AppointmentCardAdminEdit.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    pricing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    category: PropTypes.string,
    duration: PropTypes.string,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
};

export default AppointmentCardAdminEdit;
