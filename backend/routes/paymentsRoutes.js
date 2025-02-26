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

        return paymentData; // Return for testing purposes

    } catch (error) {
        console.error("Error fetching or saving payment:", error);
        throw error; // Ensure the error is thrown for proper error handling
    }
}

// Expose `fetchPayment` via an API endpoint
router.get("/fetch", async (req, res) => {
    try {
        await fetchPayment(); // Call the function
        res.status(200).json({ message: "Payment fetched and stored" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
