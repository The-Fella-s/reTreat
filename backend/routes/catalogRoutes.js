const express = require('express');
const router = express.Router();
const { SquareClient, SquareEnvironment } = require('square');
const { bigIntReplacer } = require('../utilities/helpers/replacer');
const Services = require('../models/Services');
const { SquareItemBuilder } = require('../utilities/builders/catalogBuilder');
const { generateIdempotencyKey } = require('../utilities/helpers/randomGenerator');
const mapJsonToServices = require('../utilities/mapping');
const Category = require('../models/Category');
const { createCategory } = require('../utilities/helpers/categoryHelpers');
require('dotenv').config();

const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
    userAgentDetail: 'sample_app_node_subscription',
});

router.post('/create', async (req, res) => {
    try {
        // Extract required fields from the request body.
        const { name, description, pricing, duration, category, variantName, variantId, variantPricing, variantDuration } = req.body;

        if (!name || !description || !pricing || !duration || !category) {
            return res.status(400).json({
                message: 'Missing required fields: name, description, pricing, duration, and category are required.'
            });
        }

        // Create a category in the database and Square if it does not exist.
        let categoryId;
        if (category) {
            let categoryResponse = await Category.findOne({ name: category });
            if (!categoryResponse) {
                await createCategory(client, category);
                categoryResponse = await Category.findOne({ name: category });
            }
            categoryId = categoryResponse._id;
        }

        // Create a service in the database if it does not exist.
        let mongoResponse = await Services.findOne({ name }).populate('category');
        if (!mongoResponse) {
            mongoResponse = new Services({
                name,
                description,
                pricing,
                duration,
                category: categoryId,

                // Save variant fields if provided.
                variantName: variantName || [],
                variantId: variantId || [],
                variantPricing: variantPricing || [],
                variantDuration: variantDuration || []
            });
            await mongoResponse.save();
            mongoResponse = await Services.findById(mongoResponse._id).populate('category');
        }

        let squareVersion = '0';
        if (mongoResponse.squareId) {
            const squareGetRes = await client.catalog.object.get({
                objectId: mongoResponse.squareId,
            });
            squareVersion = squareGetRes.object.version;
        }

        // Create a builder instance from the Services.
        let squareItemBuilder = await SquareItemBuilder.fromServices(mongoResponse)
            .setItemVersion(squareVersion);

        // Build the JSON for Square.
        const squareItem = squareItemBuilder.build();

        // Upsert to Square.
        const squareRes = await client.catalog.object.upsert({
            idempotencyKey: generateIdempotencyKey(),
            object: squareItem,
        });

        // Map Square JSON back to the Services model.
        const mappedData = await mapJsonToServices(squareRes, category || mongoResponse.category);

        // Build the update object, ensuring we include variant fields.
        const updateData = {
            name: mappedData.name,
            description: mappedData.description,
            pricing: mappedData.pricing,
            duration: mappedData.duration,
            category: mappedData.category,
            squareId: mappedData.squareId,
            variantName: variantName || mappedData.variantName,
            variantId: variantId || mappedData.variantId,
            variantPricing: variantPricing || mappedData.variantPricing,
            variantDuration: variantDuration || mappedData.variantDuration,
        };

        // Update the service in the database.
        const updatedServices = await Services.findOneAndUpdate(
            { name },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        // Send a created response.
        res.status(201).json({
            message: 'Catalog created successfully',
            databaseData: JSON.parse(JSON.stringify(updatedServices, bigIntReplacer)),
            squareData: JSON.parse(JSON.stringify(squareRes, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error creating catalog:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ message: 'Name parameter is missing' });

        // Search for the service in the database
        const mongoResponse = await Services.findOne({ name: name }).populate('category');
        if (!mongoResponse) return res.status(404).json({ message: 'Service not found in database, use the create endpoint to create a Catalog Service in the database.' });

        // Search for the service in Square
        const squareGetRes = await client.catalog.object.get({
            objectId: mongoResponse.squareId
        });
        if (!squareGetRes) return res.status(404).json({ message: 'Service does not exist in Square, use the create endpoint to create a Catalog Service in Square.' });

        // Send a success status
        res.status(200).json({
            message: 'Catalog obtained successfully',
            data: JSON.parse(JSON.stringify(squareGetRes, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error creating catalog:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ message: 'Name parameter is missing' });

        // Search for the service in the database
        const mongoResponse = await Services.findOne({ name: name }).populate('category');
        if (!mongoResponse) return res.status(404).json({ message: 'Service has already been deleted from the database.' });

        // Search for the service in Square
        const squareGetRes = await client.catalog.object.get({
            objectId: mongoResponse.squareId,
        });
        if (!squareGetRes) return res.status(404).json({ message: 'Service has already been deleted from Square.' });

        // Delete the service in Square
        const squareDeleteRes = await client.catalog.object.delete({ objectId: mongoResponse.squareId });
        if (squareDeleteRes) {
            // Delete the service in the database, if success, send a success status
            const mongoDeleteResponse = await Services.deleteOne({ name: name });
            if (mongoDeleteResponse) return res.status(200).json({ message: 'Service has been deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting catalog:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/update', async (req, res) => {
    try {
        const { name } = req.query;
        // Extract fields from the request body including variantPricing and variantDuration.
        const {
            name: newName,
            description,
            pricing,
            duration,
            category,
            variantName,
            variantId,
            variantPricing,
            variantDuration
        } = req.body;

        // Category is optional because you likely will not change the category
        if (!newName || !description || !pricing || !duration) return res.status(400).json({
            message: 'Missing required fields: name, description, pricing, and duration are required in the request body.'
        });
        if (!name) return res.status(400).json({ message: 'Name query is missing' });

        // Search for the service in the database
        const mongoResponse = await Services.findOne({ name }).populate('category');
        if (!mongoResponse) return res.status(404).json({ message: 'Service not found in database. Use the create endpoint to create a Catalog Service.' });

        // Search for the service in Square
        const squareGetRes = await client.catalog.object.get({ objectId: mongoResponse.squareId });
        if (!squareGetRes) return res.status(404).json({ message: 'Service does not exist in Square. Use the create endpoint to create a Catalog Service in Square.' });

        // Grab the latest version and create a builder instance.
        let latestVersion = squareGetRes.object.version;
        let squareItemBuilder = SquareItemBuilder.fromServices(mongoResponse)
            .setItemVersion(latestVersion);

        // Update name and description.
        if (newName) squareItemBuilder = squareItemBuilder.updateName(newName);
        if (description) squareItemBuilder = squareItemBuilder.updateDescription(description);

        // Update variant details.
        // When variantId is provided, we update based on the Id.
        if (variantId && variantId.length > 0) {
            for (let i = 0; i < variantId.length; i++) {
                const updatedPrice = (variantPricing && variantPricing.length > 0) ? variantPricing[i] : pricing;
                const updatedDuration = (variantDuration && variantDuration.length > 0) ? variantDuration[i] : duration;
                squareItemBuilder = squareItemBuilder.updateVariationById(
                    variantId[i],
                    updatedPrice,
                    updatedDuration,
                    'USD',
                    'FIXED_PRICING',
                    Array.isArray(variantName) ? variantName[i] : variantName
                );
            }
        }
        // Otherwise update by name.
        else if (variantName) {
            if (Array.isArray(variantName)) {
                for (let i = 0; i < variantName.length; i++) {
                    const updatedPrice = (variantPricing && variantPricing.length > 0) ? variantPricing[i] : pricing;
                    const updatedDuration = (variantDuration && variantDuration.length > 0) ? variantDuration[i] : duration;
                    squareItemBuilder = squareItemBuilder.updateVariationByName(
                        variantName[i],
                        variantName[i],
                        updatedPrice,
                        updatedDuration,
                        'USD',
                        'FIXED_PRICING'
                    );
                }
            } else {
                // Add a variation if the variation is not an array
                squareItemBuilder = squareItemBuilder.updateVariationByName(
                    variantName,
                    variantName,
                    pricing,
                    duration,
                    'USD',
                    'FIXED_PRICING'
                );
            }
        }

        // Build the Square Item.
        const squareItem = squareItemBuilder.build();

        // Upsert to Square.
        const squareRes = await client.catalog.object.upsert({
            idempotencyKey: generateIdempotencyKey(),
            object: squareItem,
        });

        // Map Square JSON to the Services model.
        const mappedData = await mapJsonToServices(squareRes, category || mongoResponse.category);

        // Build the update object including the variant arrays.
        const updateData = {
            name: mappedData.name,
            description: mappedData.description,
            pricing: mappedData.pricing,
            duration: mappedData.duration,
            category: mappedData.category,
            squareId: mappedData.squareId,
            variantName: variantName || mappedData.variantName,
            variantId: variantId || mappedData.variantId,
            variantPricing: variantPricing || mappedData.variantPricing,
            variantDuration: variantDuration || mappedData.variantDuration,
        };

        // Update the Service model.
        const updatedServices = await Services.findOneAndUpdate(
            { name },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        // Send a success status
        res.status(200).json({
            message: 'Catalog updated successfully',
            data: updatedServices,
        });
    } catch (error) {
        console.error('Error updating catalog:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/list', async (req, res) => {
    try {
        // List all catalogs from Square.
        const response = await client.catalog.list({ });

        // Send a success status
        res.status(200).json({
            message: 'Catalogs listed successfully',
            data: JSON.parse(JSON.stringify(response, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error listing catalogs:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
