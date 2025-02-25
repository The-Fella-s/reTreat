const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const google_api_key = process.env.GOOGLE_API_KEY;
const retreat_ID = process.env.RETREAT_ID;

router.get('/reviews', async (req, res) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
            params: {
                place_id: retreat_ID,  
                key: google_api_key,   
                fields: 'reviews'      
            }
        });

        console.log('Full API Response:', response.data); 

        if (!response.data.result || !response.data.result.reviews) {
            return res.status(404).json({ message: 'Reviews not found' });
        }

        const reviews = response.data.result.reviews;
        res.json({ reviews });

    } catch (error) {
        console.error('Error fetching Google reviews:', error.message);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

module.exports = router;
