const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const google_api_key = process.env.GOOGLE_API_KEY;
const retreat_ID = process.env.RETREAT_ID;

let cachedReviews = null;
let lastFetched = 0;
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

router.get('/reviews', async (req, res) => {
  const now = Date.now();

  if (cachedReviews && now - lastFetched < CACHE_DURATION_MS) {
    return res.json({ reviews: cachedReviews });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: retreat_ID,
        key: google_api_key,
        fields: 'reviews',
      },
    });

    if (!response.data.result || !response.data.result.reviews) {
      return res.status(404).json({ message: 'Reviews not found' });
    }

    cachedReviews = response.data.result.reviews;
    lastFetched = now;

    res.json({ reviews: cachedReviews });
  } catch (error) {
    console.error('Error fetching Google reviews:', error.message);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

module.exports = router;
