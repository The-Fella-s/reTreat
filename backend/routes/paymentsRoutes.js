const express = require("express");
const router = express.Router();
const { SquareClient, SquareEnvironment } = require("square");
require("dotenv").config();
const { bigIntReplacer } = require("../utilities/helpers/replacer"); // Import BigInt handler

// Initialize Square Client
const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN, // Correct token initialization
    environment: SquareEnvironment.Sandbox, // Change to Production if needed
});

// Route to List All Payments
router.get('/list', async (req, res, next) => {
    try {
        // Get all payments from Square
        const response = await client.payments.list({ count: true });
        const jsonResponse = JSON.stringify({ data: response.data }, bigIntReplacer);
        res.set('Content-Type', 'application/json');
        res.status(200).send(jsonResponse);
    } catch (error) {
        console.error('Error:', error);  // Log the error for debugging
        // Handle Square API error
        if (error instanceof SquareError) {
            const status = error.response?.status || 500;
            res.status(status).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

// Route to create a payment
router.post('/pay', async (req, res) => {
    try {
        const { amount, currency, sourceId, customerId } = req.body;

        // Validate required fields
        if (!amount || !currency || !sourceId || !customerId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create the payment using Square API
        const response = await client.payments.create({
            idempotencyKey: new Date().getTime().toString(), // Using current timestamp as a unique idempotency key
            amountMoney: {
                amount: BigInt(amount), // Make sure the amount is in the smallest currency unit (e.g., cents)
                currency,
            },
            sourceId, // Card nonce from frontend
            autocomplete: true, // Auto-complete the payment
            customerId,
            locationId: process.env.SQUARE_LOCATION_ID, // Your Square location ID
            referenceId: `REF-${Date.now()}`,
            note: "Payment processed via API",
        });

        // If payment is successful, send the response
        if (response.result.payment) {
            const jsonResponse = JSON.stringify({ data: response.result.payment }, bigIntReplacer);
            res.set("Content-Type", "application/json");
            res.status(200).send(jsonResponse);
        } else {
            throw new Error("Payment creation failed.");
        }

    } catch (error) {
        console.error('Error processing payment:', error);

        // Handle Square API error
        if (error instanceof SquareError) {
            const status = error.response?.status || 500;
            res.status(status).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

module.exports = router;
