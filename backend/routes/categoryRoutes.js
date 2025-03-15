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

async function updateCategory(name, newName) {
    try {
        let mongoResponse = await Category.findOne({ name: name });
        if (!mongoResponse) {
            return "Category not found in database. Ensure it exists before trying to update.";
        }

        let { squareId } = mongoResponse;
        if (!squareId) {
            return "Category not found in Square. Ensure it exists before trying to update.";
        }

        const retrieveResponse = await client.catalog.object.get({ objectId: squareId });
        if (!retrieveResponse || !retrieveResponse.object) {
            return "Failed to retrieve category from Square.";
        }
        const currentVersion = retrieveResponse.object.version;

        const upsertResponse = await client.catalog.object.upsert({
            idempotencyKey: generateIdempotencyKey(),
            object: {
                type: "CATEGORY",
                id: squareId,
                version: currentVersion,  // IMPORTANT: include the latest version
                categoryData: {
                    name: newName,
                },
                presentAtAllLocations: true,
            },
        });

        if (upsertResponse) {
            // Update the squareId in Mongo if necessary
            mongoResponse.name = newName;
            mongoResponse.squareId = upsertResponse.catalogObject.id;
            await mongoResponse.save();
            return upsertResponse;
        }

        return null;
    } catch (error) {
        console.error("Error: ", error);
        throw error; // Optionally rethrow or handle the error as needed
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

router.put('/update', async (req, res) => {
    try {
        const { name } = req.query;
        const { name: newName } = req.body;

        if (!name || !newName) {
            return res.status(400).json({ error: 'Both current and new category names are required' });
        }

        const updatedCategory = await updateCategory(name, newName);

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Failed to update category. Ensure it exists.' });
        }

        res.status(200).json({
            message: 'Category updated successfully',
            data: JSON.parse(JSON.stringify(updatedCategory, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

router.get('/list', async (req, res) => {
    try {
        const response = await client.catalog.search({
            objectTypes: [
                "CATEGORY",
            ]
        });

        res.status(200).json({
            message: 'Category obtained successfully',
            data: JSON.parse(JSON.stringify(response, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error getting category:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
