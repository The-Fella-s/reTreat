// paymentsRoutes.js
const express = require("express");
const router = express.Router();
const { SquareClient, SquareEnvironment } = require("square");
require("dotenv").config();
const { bigIntReplacer } = require("../utilities/helpers/replacer");

// Initialize Square Client
const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
});

// Route to List All Payments
router.get("/list", async (req, res) => {
  try {
    // Get all payments from Square
    const response = await client.payments.list({ count: true });
    const jsonResponse = JSON.stringify({ data: response.data }, bigIntReplacer);
    res.set("Content-Type", "application/json");
    res.status(200).send(jsonResponse);
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    // Always return 500 for any error
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
