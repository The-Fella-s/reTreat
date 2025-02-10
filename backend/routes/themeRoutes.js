const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');

// GET /api/themes - Retrieve all themes or create default
router.get('/', async (req, res) => {
    try {
        let themes = await Theme.find();

        if (!themes.length) {
            const defaultTheme = new Theme({ isActive: true });
            await defaultTheme.save();
            themes = [defaultTheme];
        }

        res.json(themes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/themes/active - Get active theme
router.get('/active', async (req, res) => {
    try {
        const activeTheme = await Theme.findOne({ isActive: true });
        if (!activeTheme) {
            return res.status(404).json({ error: 'No active theme found' });
        }
        res.json(activeTheme);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/themes - Create new theme
router.post('/', async (req, res) => {
    try {
        const { name, palette, typography, components } = req.body;
        const newTheme = new Theme({
            name,
            palette,
            typography,
            components,
            isActive: false
        });

        const savedTheme = await newTheme.save();
        res.status(201).json(savedTheme);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/themes/:id - Update theme
router.put('/:id', async (req, res) => {
    try {
        const { isActive } = req.body;

        // Loops all themes, make the others not active
        if (isActive) {
            await Theme.updateMany(
                { _id: { $ne: req.params.id } },
                { $set: { isActive: false } }
            );
        }

        const updatedTheme = await Theme.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedTheme) {
            return res.status(404).json({ error: 'Theme not found' });
        }

        res.json(updatedTheme);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/themes/:id - Delete theme
router.delete('/:id', async (req, res) => {
    try {
        const deletedTheme = await Theme.findByIdAndDelete(req.params.id);
        if (!deletedTheme) return res.status(404).json({ error: 'Theme not found' });
        res.json({ message: "Theme deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/themes/default - Return the default theme configuration
router.get('/default', (req, res) => {
    try {
        // Define the default theme configuration.
        // The function in MuiButton styleOverrides is replaced with
        // a fixed value, because functions are not JSON serializable.
        const defaultTheme = {
            palette: {
                primary: {
                    main: '#8ae7ed',
                },
                secondary: {
                    main: '#34bcd4',
                },
                text: {
                    primary: '#000000',
                    secondary: '#808080',
                },
            },
            typography: {
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
                MuiButton: {
                    styleOverrides: {
                        root: {
                            color: '#000000',
                        },
                    },
                },
            },
        };

        res.json(defaultTheme);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
