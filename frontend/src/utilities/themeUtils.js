import { createTheme } from '@mui/material/styles';

// Utility to make custom themes with the theme routes
export function createCustomTheme(themeData) {
    return createTheme({
        palette: themeData.palette,
        typography: {
            fontFamily: themeData.typography?.fontFamily || '"Roboto", "Helvetica", "Arial", sans-serif',
            h2: { fontFamily: themeData.typography?.h2?.fontFamily || '"Special Elite", cursive' },
            h3: { fontFamily: themeData.typography?.h3?.fontFamily || '"Special Elite", cursive' },
            h4: { fontFamily: themeData.typography?.h4?.fontFamily || '"Special Elite", cursive' },
            h5: { fontFamily: themeData.typography?.h5?.fontFamily || '"Special Elite", cursive' }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: { color: themeData.palette?.text?.primary }
                }
            }
        }
    });
}
