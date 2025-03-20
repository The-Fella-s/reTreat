const express = require('express');
const router = express.Router();
const { SquareClient, SquareEnvironment } = require('square');
// Or: const { Client, Environment } = require('square'); 
// depending on the version of the SDK you are using.
const { generateIdempotencyKey } = require('../utilities/helpers/randomGenerator'); 
const SubscriptionPlan = require('../models/SubscriptionPlan');
require('dotenv').config();

// Initialize the Square client
const client = new SquareClient({
  environment: SquareEnvironment.Sandbox, // or Production
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  userAgentDetail: 'sample_app_node_subscription',
});

/**
 * 1) Create (Upsert) a Subscription Plan in Square
 */
router.post('/plan', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    // Build the request body for a SUBSCRIPTION_PLAN object
    const requestBody = {
      idempotencyKey: generateIdempotencyKey(),
      object: {
        type: 'SUBSCRIPTION_PLAN',
        id: '#plan', // A temporary client ID; Square returns the permanent ID in the response
        presentAtAllLocations: true,
        subscriptionPlanData: {
          name: name,
          // Optionally, you can store the description or ignore it
        },
      },
    };

    // Upsert the subscription plan in Square
    const { result } = await client.catalogApi.upsertCatalogObject(requestBody);

    // The actual plan ID is in result.object.id
    const squarePlanId = result.object.id;

    // Store in Mongo if you want:
    const newPlan = new SubscriptionPlan({
      name,
      description,
      squarePlanId,
    });
    await newPlan.save();

    return res.status(201).json({
      message: 'Subscription plan created/updated successfully',
      squarePlanId,
      squareResponse: result,
    });
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 2) Create (Upsert) a Subscription Plan Variation in Square
 *    E.g. monthly tier, weekly tier, lounge access tier, etc.
 */
router.post('/variation', async (req, res) => {
  try {
    const {
      planId,      // The Square plan ID from step 1
      variationName,
      amount,      // e.g. 1500 for $15.00
      currency,    // e.g. 'USD'
      cadence,     // 'MONTHLY', 'WEEKLY', 'ANNUAL'...
    } = req.body;

    if (!planId || !variationName || !amount || !currency || !cadence) {
      return res.status(400).json({ 
        error: 'Missing required fields: planId, variationName, amount, currency, cadence' 
      });
    }

    // Build the request body for a SUBSCRIPTION_PLAN_VARIATION object
    const requestBody = {
      idempotencyKey: generateIdempotencyKey(),
      object: {
        type: 'SUBSCRIPTION_PLAN_VARIATION',
        id: '#variation', // Temporary client ID
        subscriptionPlanVariationData: {
          name: variationName,
          phases: [
            {
              cadence: cadence,  // e.g. 'MONTHLY'
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

    // Upsert the subscription plan variation
    const { result } = await client.catalogApi.upsertCatalogObject(requestBody);
    const squareVariationId = result.object.id;

    // Optionally, update your SubscriptionPlan in Mongo with this variation
    const existingPlan = await SubscriptionPlan.findOne({ squarePlanId: planId });
    if (existingPlan) {
      existingPlan.squareVariationId = squareVariationId;
      existingPlan.amount = amount / 100; // store in dollars if you like
      existingPlan.cadence = cadence;
      await existingPlan.save();
    }

    return res.status(201).json({
      message: 'Subscription plan variation created/updated successfully',
      squareVariationId,
      squareResponse: result,
    });
  } catch (error) {
    console.error('Error creating subscription plan variation:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * 3) Create a Payment Link for the subscription variation
 *    This is where the buyer can check out to subscribe.
 */
router.post('/payment-link', async (req, res) => {
  try {
    const { variationId, locationId, amount, currency, name, description } = req.body;

    if (!variationId || !locationId || !amount || !currency || !name) {
      return res.status(400).json({
        error: 'Missing required fields: variationId, locationId, amount, currency, name'
      });
    }

    // Build the request for CreatePaymentLink
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
        subscriptionPlanId: variationId, // the plan variation ID
      },
      description: description || 'Billed monthly (or weekly, etc.)',
    };

    // Create the Square payment link
    const { result } = await client.checkoutApi.createPaymentLink(requestBody);
    const { paymentLink } = result; // paymentLink.url is the link

    return res.status(200).json({
      message: 'Payment link created successfully',
      paymentLinkUrl: paymentLink?.url,
      squareResponse: result,
    });
  } catch (error) {
    console.error('Error creating payment link:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
