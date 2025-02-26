const express = require('express');
const { SquareClient, SquareEnvironment } = require("square");
const mongoose = require('mongoose');
const Payment = require('../models/Payments'); // Import MongoDB model
require('dotenv').config();

const router = express.Router();

// Initialize Square Client
const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox, 
});

// Fetch Payment and Store in MongoDB (with Upsert to Prevent Duplicates)
// We will need to pull payments from prod, not sandbox next sprint
async function fetchPayment() {
    try {
        
        const response = await client.payments.get({
            paymentId: "vnOzcMmWINoriZGHllmYHNhHWbUZY",
        });

        console.log("Fetched Payment:", response);

        if (!response.payment) {
            throw new Error("Payment object is missing from Square API response.");
        }

        if (!response.payment.amountMoney) {
            throw new Error("amountMoney is missing in the payment object.");
        }

        
        const amount = Number(response.payment.amountMoney.amount);

        
        const paymentData = await Payment.findOneAndUpdate(
            { paymentId: response.payment.id }, // Search by paymentId
            {
                status: response.payment.status,
                amount: amount / 100, // Convert cents to dollars
                currency: response.payment.amountMoney.currency,
            },
            { upsert: true, new: true } // Prevents duplicate inserts
        );

        console.log("Payment stored or updated in MongoDB:", paymentData);

    } catch (error) {
        console.error("Error fetching or saving payment:", error);
    }
}
fetchPayment();

module.exports = router;
