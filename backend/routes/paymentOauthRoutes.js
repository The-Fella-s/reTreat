const express = require("express");
const router = express.Router();
const passport = require("passport");
const { protect } = require("../middleware/authMiddleware");
const SquareBusinessAccount = require("../models/squareBusinessAccount");
const { SquareClient, SquareEnvironment } = require("square");
require("dotenv").config();

// Start OAuth flow - redirect to Square authorization page
router.get("/auth", (req, res, next) => {
  console.log("Square OAuth Auth Route Called");
  console.log("App ID:", process.env.SQUARE_APPLICATION_ID);
  console.log("Redirect URI:", process.env.SQUARE_REDIRECT_URI);
  
  passport.authenticate("square", {
    state: req.query.state || "default",
    scope: [
      "MERCHANT_PROFILE_READ", 
      "PAYMENTS_READ", 
      "PAYMENTS_WRITE", 
      "ORDERS_READ", 
      "ORDERS_WRITE", 
      "CUSTOMERS_READ", 
      "CUSTOMERS_WRITE"
    ]
  })(req, res, next);
});


// OAuth callback route
router.get(
  "/callback",
  (req, res, next) => {
    console.log("Callback Route Called");
    console.log("Full Query Parameters:", req.query);
    next();
  },
  passport.authenticate("square", { 
    failureRedirect: "/square-connection-failed",
    failureFlash: true
  }),
  (req, res) => {
    // Successful authentication redirect
    res.redirect('http://localhost:5173/');
  }
);

// Get merchant information
router.get("/merchant-info", protect, async (req, res) => {
  try {
    const query = req.query.merchantId 
      ? { merchantId: req.query.merchantId }
      : { userId: req.user._id };
      
    const squareAccount = await SquareBusinessAccount.findOne(query);
    
    if (!squareAccount) {
      return res.status(404).json({ 
        success: false, 
        message: "No Square account connected" 
      });
    }

    // Check if token is expired
    if (squareAccount.isTokenExpired()) {
      return res.status(401).json({ 
        success: false, 
        message: "Square token expired, please reconnect" 
      });
    }

    // Initialize Square client with the access token
    const client = new SquareClient({
      accessToken: squareAccount.accessToken,
      environment: process.env.NODE_ENV === "production" 
        ? SquareEnvironment.Production 
        : SquareEnvironment.Sandbox,
    });

    // Get merchant information
    const { result } = await client.merchantsApi.retrieveMerchant("me");
    
    res.status(200).json({
      success: true,
      merchant: {
        id: result.merchant.id,
        businessName: result.merchant.businessName,
        country: result.merchant.country,
        languageCode: result.merchant.language_code,
        currency: result.merchant.currency,
        status: result.merchant.status,
      }
    });
  } catch (error) {
    console.error("Error fetching merchant info:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});



router.get("/accounts", protect, async (req, res) => {
  try {
    const accounts = await SquareBusinessAccount.find()
      .select("-accessToken -refreshToken"); // Don't send tokens
      
    res.status(200).json({
      success: true,
      count: accounts.length,
      accounts
    });
  } catch (error) {
    console.error("Error listing Square accounts:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;