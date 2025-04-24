import React, {useEffect, useState} from 'react';
import {Box, Button, Grid2, TextField, Typography} from "@mui/material";
import ColorPickerComponent from "../../components/ColorPickerComponent.jsx";
import SavedThemesComponent from "../../components/SavedThemesComponent.jsx";
import axios from "axios";
import {createCustomTheme} from "../../utilities/themeUtils.js";
import PropTypes from "prop-types";

const ThemeSection = ( {setTheme} ) => {
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

  // Fetch saved themes from the backend when this component mounts
  useEffect(() => {
    axios.get('/api/themes')
      .then(response => {
        setSavedThemes(response.data);
      })
      .catch(error => {
        console.error("Error fetching themes:", error);
      });
  }, []);

  // Handle saving a new theme via POST
  const handleSubmit = (e) => {
    e.preventDefault();
    const newThemeData = {
      name: themeName,
      palette: {
        primary: { main: primaryThemeColor },
        secondary: { main: secondaryThemeColor },
        text: { primary: primaryTextColor, secondary: secondaryTextColor },
        background: { default: backgroundColor }
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h2: { fontFamily: '"Special Elite", cursive' },
        h3: { fontFamily: '"Special Elite", cursive' },
        h4: { fontFamily: '"Special Elite", cursive' },
        h5: { fontFamily: '"Special Elite", cursive' }
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { color: primaryTextColor }
          }
        }
      },
      isActive: false
    };

    axios.post('/api/themes', newThemeData)
      .then(response => {
        // Add the newly saved theme to the list
        setSavedThemes([...savedThemes, response.data]);
        console.log("Theme saved successfully:", response.data);
      })
      .catch(error => {
        console.error("Error saving theme:", error);
      });
  };

  // Activate a saved theme via a PUT request and update the global theme
  const handleActivateTheme = (themeObj) => {
    axios.put(`/api/themes/${themeObj._id}`, { isActive: true })
      .then(response => {
        // Update the global theme using the custom theme creator
        setTheme(createCustomTheme(response.data));
        console.log("Theme activated successfully:", response.data);
      })
      .catch(error => {
        console.error("Error activating theme:", error);
      });
  };

  // Delete a saved theme via a DELETE request
  const handleDeleteTheme = async (themeId) => {
    try {
      await fetch(`/api/themes/${themeId}`, {
        method: 'DELETE'
      });
      setSavedThemes(savedThemes.filter(t => t._id !== themeId));
    } catch (error) {
      console.error('Error deleting theme:', error);
    }
  };

  return (
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
          {savedThemes.map((theme) => (
            <SavedThemesComponent
              key={theme._id}
              title={theme.name}
              primaryThemeColor={theme.palette.primary.main}
              secondaryThemeColor={theme.palette.secondary.main}
              primaryTextColor={theme.palette.text.primary}
              secondaryTextColor={theme.palette.text.secondary}
              backgroundColor={theme.palette.background.default}
              handleActivate={() => handleActivateTheme(theme)}
              handleDelete={() => handleDeleteTheme(theme._id)}
            />
          ))}
        </Grid2>
      </Box>
    </Grid2>
  );
};

ThemeSection.propTypes = {
  setTheme: PropTypes.func.isRequired, // Function to set the theme
};

export default ThemeSection;
