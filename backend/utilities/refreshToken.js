// Add to your utilities/refreshToken.js file

const InstagramUser = require("../models/instagramBusinessAccount"); 
const SquareBusinessAccount = require("../models/squareBusinessAccount");
const axios = require("axios");
require("dotenv").config();

// Function to refresh Square tokens
async function refreshSquareTokens() {
  try {
    // Find Square accounts with tokens about to expire (within 24 hours)
    const expiryThreshold = new Date();
    expiryThreshold.setHours(expiryThreshold.getHours() + 24);
    
    const accounts = await SquareBusinessAccount.find({
      expiresAt: { $lt: expiryThreshold }
    });
    
    console.log(`Found ${accounts.length} Square accounts that need token refresh`);
    
    for (const account of accounts) {
      try {
        // Request new tokens using the refresh token
        const response = await axios.post('https://connect.squareup.com/oauth2/token', {
          client_id: process.env.SQUARE_APPLICATION_ID,
          client_secret: process.env.SQUARE_APPLICATION_SECRET,
          refresh_token: account.refreshToken,
          grant_type: 'refresh_token'
        });
        
        // Update the account with new tokens
        account.accessToken = response.data.access_token;
        account.refreshToken = response.data.refresh_token;
        account.expiresAt = new Date(Date.now() + (response.data.expires_in * 1000));
        await account.save();
        
        console.log(`Successfully refreshed token for merchant ${account.merchantId}`);
      } catch (error) {
        console.error(`Failed to refresh token for merchant ${account.merchantId}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error in refreshSquareTokens:', error);
  }
}

// Combine with your existing refreshTokens function
async function refreshTokens() {
  // Include any existing code for refreshing Instagram tokens
  
  // Add Square token refresh
  await refreshSquareTokens();
  
  console.log("Token refresh completed");
}

module.exports = { 
  refreshTokens,
  refreshSquareTokens
};