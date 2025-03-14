const express = require('express');
const router = express.Router();
const { SquareClient, SquareEnvironment } = require('square');
const Category = require("../models/Category");
const { bigIntReplacer } = require("../utilities/helpers/replacer");
const { generateIdempotencyKey } = require("../utilities/helpers/randomGenerator");
require('dotenv').config();

const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
    userAgentDetail: "sample_app_node_subscription",
});

async function createCategory(name) {
    try {
        let mongoResponse = await Category.findOne({ name: name });
        if (!mongoResponse) {
            mongoResponse = await Category.create({ name: name });
        }

        let { squareId } = mongoResponse;
        if (!squareId) {
            squareId = "#" + generateIdempotencyKey();
            const upsertResponse = await client.catalog.object.upsert({
                idempotencyKey: generateIdempotencyKey(),
                object: {
                    type: "CATEGORY",
                    id: squareId,
                    categoryData: {
                        name: name,
                    },
                    presentAtAllLocations: true,
                },
            });

            if (upsertResponse) {
                squareId = upsertResponse.catalogObject.id;
                mongoResponse.squareId = squareId;
                await mongoResponse.save();
            }
            return upsertResponse;
        }

        const getResponse = await client.catalog.object.get({ objectId: squareId } );
        if (getResponse) return getResponse;

        return null;
    } catch (error) {
        console.error("Error: ", error);
    }

}

async function searchCategory(name) {
    let mongoResponse = await Category.findOne({ name: name })
    if (!mongoResponse) return "Category does not exist in the database, use the create endpoint to create a Category in the database";

    let squareId = mongoResponse.squareId;
    if (!squareId) return "Category does not exist in Square, use the create endpoint to create a Category in Square";

    const getResponse = await client.catalog.object.get({ objectId: squareId } );
    if (getResponse) return getResponse;
}

async function deleteCategory(name) {
    try {
        const categoryData = await searchCategory(name);
        if (!categoryData || !categoryData.object || !categoryData.object.id) {
            console.error("Category not found in Square");
            return "Category not found in Square. Ensure it exists before trying to delete.";
        }

        const squareId = categoryData.object.id;
        const deleteResponse = await client.catalog.object.delete({ objectId: squareId });

        await Category.deleteOne({ name: name });
        return deleteResponse;
    } catch (error) {
        console.error("Error deleting category: ", error);
        throw error;
    }
}

router.post('/create', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name parameter is missing' });
        }

        const response = await createCategory(name);
        res.status(200).json({
            message: 'Category created successfully',
            data: JSON.parse(JSON.stringify(response, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: 'Name query parameter is missing' });
        }

        const response = await searchCategory(name);
        res.status(200).json({
            message: 'Category obtained successfully',
            data: JSON.parse(JSON.stringify(response, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error getting category:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const categoryData = await searchCategory(name);
        if (!categoryData || !categoryData.object) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const deleteResponse = await deleteCategory(name);
        res.status(200).json({
            message: 'Category deleted successfully',
            data: JSON.parse(JSON.stringify(deleteResponse, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
