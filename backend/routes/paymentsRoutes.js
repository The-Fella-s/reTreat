// paymentsRoutes.js
const express = require("express");
const router = express.Router();
const { SquareClient, SquareEnvironment } = require("square");
require("dotenv").config();
const { bigIntReplacer } = require("../utilities/helpers/replacer");

// Initialize Square Client
const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN, // Use your Sandbox or Production token
  environment: SquareEnvironment.Sandbox, // Change to Production if needed
});

// POST: Create a Payment
router.post("/pay", async (req, res) => {
  try {
    // You can pass these fields from the frontend
    const {
      idempotencyKey, // e.g. "7b0f3ec5-086a-4871-8f13-3c81b3875218"
      amount,         // e.g. 1000 (for $10.00)
      currency,       // e.g. "USD"
      sourceId,       // e.g. "ccof:GaJGNaZa8x4OgDJn4GB"
      customerId,     // optional
      note            // e.g. "Brief description"
    } = req.body;

    // Create the payment on Square
    const response = await client.payments.create({
      idempotencyKey: idempotencyKey || `ikey-${Date.now()}`, // fallback if not provided
      amountMoney: {
        amount: BigInt(amount), // must be a BigInt in smallest currency unit (e.g., cents)
        currency: currency || "USD",
      },
      sourceId,                // Required (nonce or card on file)
      autocomplete: true,      // Auto-completes the payment
      customerId,              // If you have a customer on file
      locationId: process.env.SQUARE_LOCATION_ID, // or pass in body
      referenceId: `REF-${Date.now()}`,           // optional reference
      note: note || "Payment processed via API",
    });

    // Check if payment succeeded
    if (response.result?.payment) {
      // Return the payment details to client
      res.status(200).json({
        success: true,
        message: "Payment successful",
        payment: response.result.payment,
      });
    } else {
      // If for some reason no payment is returned
      res.status(400).json({
        success: false,
        message: "Payment was not created",
      });
    }
  } catch (error) {
    console.error("Payment Error:", error);
    // Return a 500 error on any failure
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Existing GET route to list payments
router.get("/list", async (req, res) => {
  try {
    const response = await client.payments.list({ count: true });
    const jsonResponse = JSON.stringify({ data: response.data }, bigIntReplacer);
    res.set("Content-Type", "application/json");
    res.status(200).send(jsonResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
