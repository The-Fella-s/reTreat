// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const { SquareClient, SquareEnvironment } = require('square');
const { generateIdempotencyKey } = require('../utilities/helpers/randomGenerator');
const { bigIntReplacer } = require('../utilities/helpers/replacer');
require('dotenv').config();

// Initialize the Square client (using the same style as your catalog routes)
const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox, // Use Sandbox for testing
    userAgentDetail: 'sample_app_node_subscription',
});

/**
 * POST /api/subscriptions/plan
 * Create a Subscription Plan (Square Catalog object type: SUBSCRIPTION_PLAN)
 */
router.post('/plan', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }

        // Build the request body for a SUBSCRIPTION_PLAN object.
        const requestBody = {
            idempotencyKey: generateIdempotencyKey(),
            object: {
                type: 'SUBSCRIPTION_PLAN',
                id: "#plan", // temporary ID; Square returns a permanent ID
                presentAtAllLocations: true,
                subscriptionPlanData: {
                    name: name,
                    // You can include additional properties if needed.
                },
            },
        };

        // Upsert the subscription plan to Square
        const response = await client.catalog.object.upsert({
            idempotencyKey: generateIdempotencyKey(),
            object: requestBody.object,
        });

        // Use JSON.stringify with bigIntReplacer to convert any BigInt values
        return res.status(201).json({
            message: 'Subscription plan created successfully',
            squareResponse: JSON.parse(JSON.stringify(response, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error creating subscription plan:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/subscriptions/variation
 * Create a Subscription Plan Variation (Square Catalog object type: SUBSCRIPTION_PLAN_VARIATION)
 */
router.post('/variation', async (req, res) => {
    try {
        const { planId, variationName, amount, currency, cadence } = req.body;
        if (!planId || !variationName || !amount || !currency || !cadence) {
            return res.status(400).json({ message: 'Missing required fields: planId, variationName, amount, currency, cadence' });
        }

        // Build the request body for a SUBSCRIPTION_PLAN_VARIATION object.
        const requestBody = {
            idempotencyKey: generateIdempotencyKey(),
            object: {
                type: 'SUBSCRIPTION_PLAN_VARIATION',
                id: "#variation", // temporary client-side ID
                subscriptionPlanVariationData: {
                    name: variationName,
                    phases: [
                        {
                            cadence: cadence, // e.g., "MONTHLY", "WEEKLY"
                            pricing: {
                                type: 'STATIC',
                                priceMoney: {
                                    amount: Number(amount),
                                    currency: currency,
                                },
                            },
                        },
                    ],
                    subscriptionPlanId: planId,
                },
            },
        };

        // Upsert the subscription plan variation to Square
        const response = await client.catalog.object.upsert({
            idempotencyKey: generateIdempotencyKey(),
            object: requestBody.object,
        });

        return res.status(201).json({
            message: 'Subscription plan variation created successfully',
            squareResponse: JSON.parse(JSON.stringify(response, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error creating subscription plan variation:', error);
        return res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/subscriptions/payment-link
 * Create a Square-hosted payment link for the subscription variation.
 */
router.post('/payment-link', async (req, res) => {
    try {
        const { variationId, locationId, amount, currency, name, description } = req.body;
        if (!variationId || !locationId || !amount || !currency || !name) {
            return res.status(400).json({ message: 'Missing required fields: variationId, locationId, amount, currency, name' });
        }

        // Build the request body for the CreatePaymentLink endpoint.
        const requestBody = {
            idempotencyKey: generateIdempotencyKey(),
            quickPay: {
                locationId: locationId,
                name: name,
                priceMoney: {
                    amount: Number(amount),
                    currency: currency,
                },
            },
            checkoutOptions: {
                subscriptionPlanId: variationId, // payment link subscribes to the plan variation
            },
            description: description || 'Subscription Payment',
        };

        // Create the payment link using Square's Checkout API
        const response = await client.checkoutApi.createPaymentLink(requestBody);

        return res.status(200).json({
            message: 'Payment link created successfully',
            squareResponse: JSON.parse(JSON.stringify(response, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error creating payment link:', error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
