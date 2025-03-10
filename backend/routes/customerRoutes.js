const express = require('express');
const router = express.Router();
const { SquareClient, SquareEnvironment, SquareError } = require('square');
require('dotenv').config();
const crypto = require('crypto');
const User = require('../models/User');
const { bigIntReplacer } = require("../utilities/helpers/replacer");

// Initialize Square client
const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
    userAgentDetail: "sample_app_node_subscription",
});

// Route to create a new Square customer
router.post('/create', async (req, res, next) => {
    try {
        // Query for email
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email body parameter is required' });

        // Search the database for a user with the given email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found in database' });

        // Use the Square API to search for an existing customer by email
        const searchCustomersResponse = await client.customers.search({
            query: {
                filter: {
                    emailAddress: { exact: user.email },
                },
            },
        });

        let squareId;
        const existingCustomer = searchCustomersResponse.customers?.[0] || null;

        // If the customer exists in Square
        if (existingCustomer) {
            squareId = existingCustomer.id;

            // Update the database with the Square ID if not already present
            if (!user.squareId) {
                user.squareId = squareId;
                await user.save();
            }
            return res.status(200).json({ message: "User already has a Square ID" });
        }

        // No existing customer; create a new one via Square API
        const customerData = {
            idempotencyKey: crypto.randomUUID(),
            givenName: user.name.split(' ')[0] || user.name,
            familyName: user.name.split(' ')[1] || '',
            emailAddress: user.email,
            phoneNumber: user.phone || '',
        };

        // Create the new customer in Square
        const createResponse = await client.customers.create(customerData);

        // Save the newly created Square ID in the database
        user.squareId = createResponse.customer.id;
        await user.save();
        res.status(201).json({ message: "User Square ID created" });

    } catch (error) {
        // Handle errors
        if (error.response && error.response.data) {
            return res.status(error.response.status).json({ error: error.response.data.error });
        }
        next(error);
    }
});

// Route to delete a Square customer
router.delete('/delete', async (req, res, next) => {
    try {
        // Query for email
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email body parameter is required' });

        // Search the database for a user with the given email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found in database' });

        // Search for the customer in Square
        const searchCustomersResponse = await client.customers.search({
            query: {
                filter: {
                    emailAddress: { exact: email },
                },
            },
        });

        const customers = searchCustomersResponse.customers;
        if (!customers || customers.length === 0) return res.status(404).json({ error: 'Customer not found' });

        // Get the customer ID from Square
        const customerId = customers[0].id;

        // Delete the customer from Square
        const response = await client.customers.delete({ customerId });
        res.status(200).json({
            message: 'Customer deleted successfully',
            response
        });

    } catch (error) {
        // Handle Square API error
        if (error instanceof SquareError) {
            const status = error.response?.status || 500;
            res.status(status).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

// Route to update a Square customer
router.put('/update', async (req, res, next) => {
    try {
        // Query for required parameters
        const { email, name, phone } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email body parameter is required' });
        }

        // Search the database for a user with the given email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found in database' });
        }

        // Update local database fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;

        // If the user has a Square ID, update the user information in Square as well
        if (user.squareId) {
            const updateData = {};
            if (name) {
                const nameParts = name.split(' ');
                updateData.givenName = nameParts[0];
                updateData.familyName = nameParts[1] || '';
            }
            if (phone) updateData.phoneNumber = phone;

            try {
                // Update customer in Square
                await client.customers.update({
                    customerId: user.squareId,
                    givenName: updateData.givenName,
                    familyName: updateData.familyName,
                    phoneNumber: updateData.phoneNumber,
                });
            } catch (squareError) {
                const status = squareError.response?.status || 500;
                return res.status(status).json({ error: 'Failed to update customer in Square', details: squareError.message });
            }
        }

        // Save the updated user to the database
        await user.save();
        res.status(200).json({ message: 'User information updated successfully in the database and SquareAPI', user });
    } catch (error) {
        next(error);
    }
});

// Route to search for a customer
router.get('/search', async (req, res, next) => {
    try {
        // Query for email
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email body parameter is required' });

        // Search the database for a user with the given email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found in database' });

        // If the user has a Square ID, return it from the database
        if (user.squareId) {
            return res.status(200).json({ squareId: user.squareId, source: "Database" });
        }

        // If no Square ID, search for the customer in Square
        const response = await client.customers.search({
            count: true,
            query: {
                filter: {
                    emailAddress: {
                        exact: email,
                    },
                },
            },
        });

        // Return the customer data
        const jsonResponse = JSON.stringify(response.customers, bigIntReplacer);
        res.set('Content-Type', 'application/json');
        res.status(200).send(jsonResponse);
    } catch (error) {
        // Handle Square API error
        if (error instanceof SquareError) {
            const status = error.response?.status || 500;
            res.status(status).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

// Route to list all customers
router.get('/list', async (req, res, next) => {
    try {
        // Get all customers from Square
        const response = await client.customers.list({ count: true });
        const jsonResponse = JSON.stringify({ data: response.data }, bigIntReplacer);
        res.set('Content-Type', 'application/json');
        res.status(200).send(jsonResponse);
    } catch (error) {
        console.error('Error:', error);  // Log the error for debugging
        // Handle Square API error
        if (error instanceof SquareError) {
            const status = error.response?.status || 500;
            res.status(status).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

module.exports = router;
