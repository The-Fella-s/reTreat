import React, {useMemo, useState} from 'react';
import {Box, Button, CssBaseline, Grid2, TextField, Typography} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import ColorPickerComponent from "../../components/ColorPickerComponent.jsx";
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

    // State to track the active theme
    const [activeTheme, setActiveTheme] = useState({
        primaryThemeColor,
        secondaryThemeColor,
        primaryTextColor,
        secondaryTextColor,
        backgroundColor,
    });

    // Function to create a Material UI theme object dynamically based on the active theme state
    const muiTheme = useMemo(() => createTheme({
        palette: {
            primary: { main: activeTheme.primaryThemeColor },
            secondary: { main: activeTheme.secondaryThemeColor },
            text: {
                primary: activeTheme.primaryTextColor,
                secondary: activeTheme.secondaryTextColor,
            },
            background: { default: activeTheme.backgroundColor },
        },
    }), [activeTheme]);  // Only recreate the theme when the activeTheme state changes

    // Function to handle the form submission for saving a new theme
    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent default form submission behavior
        const newTheme = {
            name: themeName,
            primaryThemeColor,
            secondaryThemeColor,
            primaryTextColor,
            secondaryTextColor,
            backgroundColor,
        };

        console.log("Saving theme: ", newTheme);

        // Save the new theme to the savedThemes array
        setSavedThemes([...savedThemes, newTheme]);
        console.log("Theme saved successfully: ", savedThemes);
    };

    // Function to apply a saved theme by setting it as the active theme
    const handleActivateTheme = (theme) => {
        console.log("Activating theme: ", theme);
        setActiveTheme(theme);
        console.log("Theme activated successfully");
    };

    // Function to delete a saved theme by filtering it out from the savedThemes array
    const handleDeleteTheme = (index) => {
        try {
            // Retrieve the theme that will be deleted for logging purposes
            const themeToRemove = savedThemes[index];
            console.log("Deleting theme:", themeToRemove);

            // Update the saved themes by filtering out the theme at the given index
            setSavedThemes((previousThemes) => {
                return previousThemes.filter((theme, filterIndex) => filterIndex !== index);
            });

            // Optionally, display a success message or execute another function here
            console.log("Theme deleted successfully.");
        } catch (error) {
            // Handle potential errors, such as invalid index or other issues
            console.error("Error deleting theme:", error);
        }
    };

    return (
        <ThemeProvider theme={muiTheme}>  {/* Apply the dynamically created theme */}
            <CssBaseline />  {/* Ensure a consistent baseline style */}
            <Grid2>
                <Typography variant="h4">
                    Theme Management
                </Typography>

                {/* Form for creating a new theme */}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Theme Name"
                        value={themeName}
                        onChange={(e) => setThemeName(e.target.value)}  // Update theme name
                        fullWidth
                        margin="normal"
                        required  // Make the theme name field required
                    />

                    <Grid2 container direction="row" spacing={4}>
                        {/* Color pickers for different theme colors */}
                        <ColorPickerComponent title="Primary theme color" color={primaryThemeColor} setColor={setPrimaryThemeColor} />
                        <ColorPickerComponent title="Secondary theme color" color={secondaryThemeColor} setColor={setSecondaryThemeColor} />
                        <ColorPickerComponent title="Primary text color" color={primaryTextColor} setColor={setPrimaryTextColor} />
                        <ColorPickerComponent title="Secondary text color" color={secondaryTextColor} setColor={setSecondaryTextColor} />
                        <ColorPickerComponent title="Background color" color={backgroundColor} setColor={setBackgroundColor} />
                    </Grid2>

                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                        Save Theme  {/* Button to submit the form and save the theme */}
                    </Button>
                </form>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>Saved Themes</Typography>

                    {/* Display a list of saved themes */}
                    <Grid2 sx={{ mt: 4 }} container direction="row" spacing={4}>
                        {savedThemes.map((theme, index) => (
                            <SavedThemesComponent
                                key={index}
                                title={theme.name}
                                primaryThemeColor={theme.primaryThemeColor}
                                secondaryThemeColor={theme.secondaryThemeColor}
                                primaryTextColor={theme.primaryTextColor}
                                secondaryTextColor={theme.secondaryTextColor}
                                backgroundColor={theme.backgroundColor}
                                handleActivate={() => handleActivateTheme(theme)}  // Apply theme when clicked
                                handleDelete={() => handleDeleteTheme(index)}  // Delete theme when clicked
                            />
                        ))}
                    </Grid2>
                </Box>
            </Grid2>
        </ThemeProvider>
    );
};

export default ThemeSection;
