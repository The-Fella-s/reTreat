import React from 'react';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import PropTypes from "prop-types";

// SavedThemesComponent displays a card representing a saved theme with its colors and actions.
// Props:
// - title: The name of the theme.
// - primaryColor, secondaryColor, tertiaryColor, backgroundColor: Color values for the theme.
// - handleActivate: Function to call when the "Activate" button is clicked.
// - handleDelete: Function to call when the "Delete" button is clicked.
// - handleDefault: Function to call when the "Default" button is clicked.
const SavedThemesComponent = ({ title, primaryColor, secondaryColor, tertiaryColor, backgroundColor, handleActivate, handleDelete, handleDefault }) => {
    // Array of color entries with their corresponding labels.
    const colorEntries = [
        { color: primaryColor, label: 'Primary' },
        { color: secondaryColor, label: 'Secondary' },
        { color: tertiaryColor, label: 'Tertiary' },
        { color: backgroundColor, label: 'Background' },
    ];

    return (
        <Card sx={{ maxWidth: 220 }}>
            <CardContent>

                {/* Display the theme title */}
                <Typography variant="h5" component="div">
                    {title}
                </Typography>

                {/* Display the color swatches and their labels */}
                <Grid container direction="column">
                    {colorEntries.map((entry, index) => (
                        <Grid container alignItems="center" key={index} sx={{ mb: 1 }}>
                            {/* Color swatch box */}
                            <Box
                                sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '4px',
                                    bgcolor: entry.color,
                                }}
                            />
                            {/* Label for the color */}
                            <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                {entry.label}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>

            {/* Action buttons */}
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button size="small" onClick={handleActivate}>
                    Activate
                </Button>
                <Button size="small" onClick={handleDelete}>
                    Delete
                </Button>
                <Button size="small" onClick={handleDefault}>
                    Default
                </Button>
            </CardActions>
        </Card>
    );
};

export default SavedThemesComponent;

SavedThemesComponent.propTypes = {
    title: PropTypes.string.isRequired, // The name of the theme
    primaryColor: PropTypes.string.isRequired, // Color value for the primary color
    secondaryColor: PropTypes.string.isRequired, // Color value for the secondary color
    tertiaryColor: PropTypes.string.isRequired, // Color value for the tertiary color
    backgroundColor: PropTypes.string.isRequired, // Color value for the background
    handleActivate: PropTypes.func.isRequired, // Function to call when the "Activate" button is clicked
    handleDelete: PropTypes.func.isRequired, // Function to call when the "Delete" button is clicked
    handleDefault: PropTypes.func.isRequired, // Function to call when the "Default" button is clicked
};
