const express = require('express');
const router = express.Router();
const { SquareClient, SquareEnvironment, SquareError } = require('square');
require('dotenv').config();
const User = require('../models/User');
const { bigIntReplacer } = require('../utilities/helpers/replacer');
const { createCard, deleteFirstCard, handleCardError } = require("../utilities/helpers/cardHelpers");

// Initialize Square client
const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
  userAgentDetail: "sample_app_node_subscription",
});

// Create Card
router.post('/create', async (req, res, next) => {
  try {
    // Query for emails
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' });

    // Search the database for a user with the given email
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found in database' });

    // Check if the squareId is valid
    const customerId = user.squareId;
    if (!customerId) return res.status(404).json({ error: 'User does not have a Square account linked' });

    // Create the card
    const card = await createCard(client, customerId, req.body);

    // Save the card id in the database
    user.cardId = card.id;
    await user.save();

    const jsonCard = JSON.stringify(card, bigIntReplacer);
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonCard);
  } catch (error) {
    handleCardError(error, res, next);
  }
});

router.get('/retrieve', async (req, res, next) => {
  try {
    // Query for emails
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' });

    // Search the database for a user with the given email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found in database' });

    // Check if the squareId is valid
    const customerId = user.squareId;
    if (!customerId) return res.status(404).json({ error: 'User does not have a Square account linked' });

    // Check if the cardId is valid
    const cardId = user.cardId;
    if (!cardId) return res.status(404).json({ error: 'User does not have a Card linked' });

    // Retrieve the card list
    const listResponse = await client.cards.list({ customerId });

    if (!listResponse.data.length) return res.status(404).json({ message: 'No cards found' });

    // Loop for the active card
    let selectedCard;
    for (const cardIndex in listResponse.data) {
      const squareCardId = listResponse.data[cardIndex].id;
      if (squareCardId === cardId) {
        selectedCard = listResponse.data[cardIndex].id
      }
    }

    if (selectedCard == null) return res.status(404).json({ message: 'No cards found' });

    // Fetch details of the active card
    const cardDetailsResponse = await client.cards.get({ cardId: selectedCard });

    // Ensure JSON.stringify handles BigInt values correctly
    const jsonResponse = JSON.stringify(cardDetailsResponse, bigIntReplacer);
    res.set('Content-Type', 'application/json');
    res.status(200).send(jsonResponse);
  } catch (error) {
    console.error('Error fetching cards:', error);
    next(error);
  }
});

// Update Card
router.put('/update', async (req, res, next) => {
  try {
    // Query for emails
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' });

    // Search database for the email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if the squareId is valid
    const customerId = user.squareId;
    if (!customerId) return res.status(404).json({ error: 'User does not have a Square account linked' });

    // Delete the first card
    await deleteFirstCard(client, customerId);

    // Create the card
    const card = await createCard(client, customerId, req.body);

    // Save the card id in the database
    user.cardId = card.id;
    await user.save();

    res.json({ message: "Card updated successfully" });
  } catch (error) {
    handleCardError(error, res, next);
  }
});

// Route to delete card
router.delete("/delete", async (req, res) => {
  try {
    // Query for emails
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' });

    // Search database for the email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if the squareId is valid
    const customerId = user.squareId;
    console.log(customerId);
    if (!customerId) return res.status(404).json({ error: 'User does not have a Square account' });

    // Delete the first card
    await deleteFirstCard(client, customerId);

    // Delete card id in database
    user.cardId = "";
    await user.save();

    res.json({ message: `Card deleted successfully` });
  } catch (error) {
    handleCardError(error, res);
  }
});

module.exports = router;
