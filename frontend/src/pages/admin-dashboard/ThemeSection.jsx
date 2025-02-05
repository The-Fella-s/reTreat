import React, { useState } from 'react';
import ColorPickerComponent from "../../components/ColorPickerComponent.jsx";
import { Box, Button, Grid2, TextField, Typography } from "@mui/material";
import SavedThemesComponent from "../../components/SavedThemesComponent.jsx";

const ThemeSection = () => {
    // State to manage the name of the theme
    const [themeName, setThemeName] = useState('');

    // States to manage the colors of the theme
    const [primaryThemeColor, setPrimaryThemeColor] = useState('#8ae7ed');
    const [secondaryThemeColor, setSecondaryThemeColor] = useState('#34bcd4');
    const [primaryTextColor, setPrimaryTextColor] = useState('#000000');
    const [secondaryTextColor, setSecondaryTextColor] = useState('#808080');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    // State to manage the list of saved themes
    const [savedThemes, setSavedThemes] = useState([]);

    // Function to handle the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Create a new theme object with the current state values
        const newTheme = {
            name: themeName,
            primaryThemeColor,
            secondaryThemeColor,
            primaryTextColor,
            secondaryTextColor,
            backgroundColor,
        };

        // Add the new theme to the saved themes array
        setSavedThemes([...savedThemes, newTheme]);

        // Log the updated list of saved themes to the console
        console.log(savedThemes);
    };

    return (
        <Grid2>
            {/* Header for the theme management section */}
            <Typography variant="h4">
                Theme Management
            </Typography>

            {/* Form to input theme details */}
            <form onSubmit={handleSubmit}>
                {/* Input field for the theme name */}
                <TextField
                    label="Theme Name"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />

                {/* Container for color pickers */}
                <Grid2 container direction="row" spacing={4}>
                    {/* Color picker for primary theme color */}
                    <ColorPickerComponent
                        title="Primary theme color"
                        color={primaryThemeColor}
                        setColor={setPrimaryThemeColor}
                    />
                    {/* Color picker for secondary theme color */}
                    <ColorPickerComponent
                        title="Secondary theme color"
                        color={secondaryThemeColor}
                        setColor={setSecondaryThemeColor}
                    />
                    {/* Color picker for primary text color */}
                    <ColorPickerComponent
                        title="Primary text color"
                        color={primaryTextColor}
                        setColor={setPrimaryTextColor}
                    />
                    {/* Color picker for secondary text color */}
                    <ColorPickerComponent
                        title="Secondary text color"
                        color={secondaryTextColor}
                        setColor={setSecondaryTextColor}
                    />
                    {/* Color picker for background color */}
                    <ColorPickerComponent
                        title="Background color"
                        color={backgroundColor}
                        setColor={setBackgroundColor}
                    />
                </Grid2>

                {/* Button to save the theme */}
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Save Theme
                </Button>
            </form>

            {/* Section to display saved themes */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Saved Themes</Typography>

                {/* Component to list saved themes */}
                <SavedThemesComponent
                    title="Test theme"
                    primaryThemeColor={primaryThemeColor}
                    secondaryThemeColor={secondaryThemeColor}
                    primaryTextColor={primaryTextColor}
                    secondaryTextColor={secondaryTextColor}
                    backgroundColor={backgroundColor}
                    handleActivate={() => { /* Function to handle theme activation */ }}
                    handleDefault={() => { /* Function to handle setting theme as default */ }}
                    handleDelete={() => { /* Function to handle theme deletion */ }}
                />
            </Box>
        </Grid2>
    );
};

export default ThemeSection;
