import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#8ae7ed',
        },
        secondary: {
            main: '#34bcd4',
        },
        text: {
            primary: '#000000', // Primary text color: black
            secondary: '#808080', // Secondary text color: gray
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // default font
        // Special Elite fonts for h2 -> h5
        // h6 is used for other stuff
        h2: {
            fontFamily: '"Special Elite", cursive',
        },
        h3: {
            fontFamily: '"Special Elite", cursive',
        },
        h4: {
            fontFamily: '"Special Elite", cursive',
        },
        h5: {
            fontFamily: '"Special Elite", cursive',
        },
    },
    components: {
        // Override MUI Button styles
        MuiButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // Use theme's primary text color
                    // Will update if the primary text color above updates
                    color: theme.palette.text.primary,
                }),
            },
        },
    },
});

export default theme;