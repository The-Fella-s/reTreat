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

async function refreshTokensForUser(user) {
  try {

    // Exchange the current token for a fresh long-lived token.
    const tokenResponse = await axios.get("https://graph.facebook.com/v22.0/oauth/access_token", {
      params: {
        grant_type: "fb_exchange_token",
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        fb_exchange_token: user.accessToken
      }
    });
    const newAccessToken = tokenResponse.data.access_token;

    // Refresh the pageAccessToken
    const pagesResponse = await axios.get("https://graph.facebook.com/v22.0/me/accounts", {
      params: { access_token: newAccessToken }
    });
    if (!pagesResponse.data.data || !pagesResponse.data.data.length) {
      throw new Error("No connected Facebook pages found during token refresh");
    }
    const page = pagesResponse.data.data[0];

    // Update user tokens and timestamp in the database
    user.accessToken = newAccessToken;
    user.pageAccessToken = page.access_token;
    user.generatedAt = new Date();

    await user.save();
    console.log(`Tokens refreshed for Instagram ID: ${user.instagramId}`);
  } catch (error) {
    console.error(`Error refreshing tokens for Instagram ID ${user.instagramId}:`, error.message);
  }
}

async function refreshInstagramTokens() {
  try {
    // Refresh tokens 2 days before they expire (for a 60-day token validity)
    const THRESHOLD_DAYS = 58;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - THRESHOLD_DAYS);

    // Query only users whose tokens were generated before the threshold date
    const users = await InstagramUser.find({ generatedAt: { $lte: thresholdDate } });

    for (const user of users) {
      await refreshTokensForUser(user);
    }
  } catch (error) {
    console.error("Error in token refresh process:", error.message);
  }
}

async function refreshTokens() {
  // Refresh the Instagram tokens
  await refreshInstagramTokens();

  // Refresh the Square tokens
  await refreshSquareTokens();

  console.log("Token refresh completed");
}

module.exports = {
  refreshTokens,
};
