import React from 'react';
import { SketchPicker } from 'react-color';
import {Grid2, TextField, Typography} from '@mui/material';
import PropTypes from "prop-types";

// ColorPickerComponent allows users to select a color using a color picker and displays the selected color.
// Props:
// - title: The title displayed above the color picker.
// - color: The current color value in HEX format.
// - setColor: Function to update the color state in the parent component.
const ColorPickerComponent = ({ title, color, setColor }) => {
    // Handle color change from the SketchPicker
    const handleChange = (newColor) => {
        setColor(newColor.hex);
    };

    // Function to determine appropriate text color (black or white) based on background color brightness
    const getContrastColor = (hex) => {
        if (!hex) return '#000'; // Default to black if no color is set

        // Convert HEX to RGB
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);

        // Calculate luminance
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        // Return black or white text color based on luminance
        return luminance > 128 ? '#000' : '#fff';
    };

    return (
        <Grid2
            container
            justifyContent="center"
            alignItems="center"
            sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}
        >

            {/* Display the title */}
            <Typography variant="h5" textAlign="center">
                {title}
            </Typography>

            {/* Display the selected color in a read-only text field with background color */}
            <TextField
                value={color}
                InputProps={{
                    style: {
                        cursor: 'pointer',
                        backgroundColor: color,
                        color: getContrastColor(color),
                        width: '220px',
                        textAlign: 'center',
                    },
                }}
                readOnly
            />

            {/* SketchPicker component for color selection */}
            <SketchPicker color={color} onChange={handleChange} />

        </Grid2>
    );
};

export default ColorPickerComponent;

// PropTypes for ColorPickerComponent component
ColorPickerComponent.propTypes = {
    title: PropTypes.string.isRequired, // The name of the type of color i.e. primary, secondary, tertiary, etc.
    color: PropTypes.string.isRequired, // The selected color
    setColor: PropTypes.func.isRequired, // The function that updates the color
};
