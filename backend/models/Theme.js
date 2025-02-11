const mongoose = require('mongoose');

// Theme schema with default theme colors for the website
const ThemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Unnamed Theme'
    },
    palette: {
        primary: {
            main: { type: String, default: '#8ae7ed' }
        },
        secondary: {
            main: { type: String, default: '#34bcd4' }
        },
        text: {
            primary: { type: String, default: '#000000' },
            secondary: { type: String, default: '#808080' }
        },
        background: {
            default: { type: String, default: '#ffffff' }
        }
    },
    typography: {
        fontFamily: {
            type: String,
            default: '"Roboto", "Helvetica", "Arial", sans-serif'
        },
        h2: {
            fontFamily: { type: String, default: '"Special Elite", cursive' }
        },
        h3: {
            fontFamily: { type: String, default: '"Special Elite", cursive' }
        },
        h4: {
            fontFamily: { type: String, default: '"Special Elite", cursive' }
        },
        h5: {
            fontFamily: { type: String, default: '"Special Elite", cursive' }
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: { type: String, default: '#000000' }
                }
            }
        }
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false }); // Pass versionKey here to disable __v

module.exports = mongoose.model('Theme', ThemeSchema);
