const express = require('express');
const router = express.Router();
const { SquareClient, SquareEnvironment } = require('square');
const crypto = require('crypto');
require('dotenv').config();

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox, // Change to Production when ready
});

// Payment link creation route
router.post('/create-payment-link', async (req, res) => {
  try {
    const { items } = req.body;
    
    console.log('Received items:', items); // Debug log

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid items data',
        details: 'Items array is required and must not be empty' 
      });
    }

    // Convert items to Square line items format
    const lineItems = items.map(item => {
      if (!item.name || !item.price || !item.quantity) {
        throw new Error('Each item must have name, price, and quantity');
      }
      
      return {
        name: item.name.substring(0, 255), // Square has a 255 char limit for names
        quantity: item.quantity.toString(),
        basePriceMoney: {
          amount: BigInt(Math.round(item.price * 100)), // Convert to cents
          currency: 'USD',
        },
      };
    });

    // Create payment link with order details
    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: process.env.LOCATION_ID,
        lineItems: lineItems,
      },
    });

    console.log('Square API response:', response); // Debug log

    if (!response.paymentLink?.url) {
      throw new Error('No payment URL received from Square');
    }

    res.json({
      paymentLink: response.paymentLink.url,
      paymentId: response.paymentLink.id
    });

  } catch (error) {
    console.error('Error creating payment link:', error);
    
    // Provide more detailed error information
    const errorResponse = {
      error: 'Failed to create payment link',
      details: error.message,
    };
    
    if (error.errors) {
      errorResponse.squareErrors = error.errors;
    }
    
    res.status(500).json(errorResponse);
  }
});

module.exports = router;