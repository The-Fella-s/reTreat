// paymentsRoutes.js
const express = require("express");
const router = express.Router();
const { SquareClient, SquareEnvironment } = require("square");
const SquareBusinessAccount = require("../models/squareBusinessAccount");
const { protect } = require("../middleware/authMiddleware");
const { bigIntReplacer } = require("../utilities/helpers/replacer");
require("dotenv").config();

// Helper function to get a Square client
async function getSquareClient(merchantId) {
  if (merchantId) {
    // If merchantId provided, use that merchant's OAuth token
    const account = await SquareBusinessAccount.findOne({ merchantId });
    if (!account) {
      throw new Error("Square account not found");
    }
    
    if (account.isTokenExpired()) {
      throw new Error("Square token expired, please reconnect");
    }
    
    return new SquareClient({
      accessToken: account.accessToken,
      environment: process.env.NODE_ENV === "sandbox" 
        ? SquareEnvironment.Production 
        : SquareEnvironment.Sandbox,
    });
  }
  
  // Otherwise use the application's access token
  return new SquareClient({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: process.env.NODE_ENV === "sandbox" 
      ? SquareEnvironment.Production 
      : SquareEnvironment.Sandbox,
  });
}

// POST: Create a Payment
router.post("/pay", async (req, res) => {
  try {
    // You can pass these fields from the frontend
    const {
      idempotencyKey,
      amount,
      currency,
      sourceId,
      customerId,
      note,
      merchantId
    } = req.body;
    
    // Get Square client (either app token or merchant OAuth token)
    const client = await getSquareClient(merchantId);

    // Create the payment on Square
    const response = await client.paymentsApi.createPayment({
      idempotencyKey: idempotencyKey || `ikey-${Date.now()}`, // fallback if not provided
      amountMoney: {
        amount: BigInt(amount), // must be a BigInt in smallest currency unit (e.g., cents)
        currency: currency || "USD",
      },
      sourceId,                // Required (nonce or card on file)
      autocomplete: true,      // Auto-completes the payment
      customerId,              // If you have a customer on file
      locationId: merchantId ? undefined : process.env.SQUARE_LOCATION_ID, // Use app location ID if no merchant
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

// GET: List payments
router.get("/list", async (req, res) => {
  try {
    const { merchantId } = req.query;
    
    // Get Square client (either app token or merchant OAuth token)
    const client = await getSquareClient(merchantId);
    
    const response = await client.paymentsApi.listPayments({
      beginTime: req.query.beginTime,
      endTime: req.query.endTime,
      sortOrder: req.query.sortOrder || "DESC",
      limit: parseInt(req.query.limit) || 100
    });
    
    const jsonResponse = JSON.stringify(
      { data: response.result }, 
      bigIntReplacer
    );
    
    res.set("Content-Type", "application/json");
    res.status(200).send(jsonResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;