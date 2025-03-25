const express = require('express');
const router = express.Router();
const { SquareClient, SquareEnvironment } = require('square');
const { bigIntReplacer } = require('../utilities/helpers/replacer');
require('dotenv').config();

const {
    createCategory,
    searchCategory,
    deleteCategory,
    updateCategory,
} = require('../utilities/helpers/categoryHelpers');
const Category = require("../models/Category");

const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
    userAgentDetail: 'sample_app_node_subscription',
});

router.post('/create', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Name parameter is missing' });

        const response = await createCategory(client, name);
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
        if (!name) return res.status(400).json({ message: 'Name query parameter is missing' });

        const response = await searchCategory(client, name);
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
        if (!name) return res.status(400).json({ error: 'Category name is required' });

        const categoryData = await searchCategory(client, name);
        if (!categoryData || !categoryData.object) return res.status(404).json({ error: 'Category not found' });

        const deleteResponse = await deleteCategory(client, name);
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

        if (!name || !newName) return res.status(400).json({ error: 'Both current and new category names are required' });

        const updatedCategory = await updateCategory(client, name, newName);
        if (!updatedCategory) return res.status(404).json({ error: 'Failed to update category. Ensure it exists.' });

        res.status(200).json({
            message: 'Category updated successfully',
            data: JSON.parse(JSON.stringify(updatedCategory, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Allows you to get the category list whether it is from Square or from the database
router.get('/list', async (req, res) => {
    try {
        const source = req.query.source;
        if (!source) return res.status(400).json({ error: 'Source is required' });
        if (!["square", "database", "mongo", "mongodb"].includes(source)) {
            return res.status(400).json({ error: 'Source must be either from Square or the database' });
        }

        let response;

        if (source === "square") {
            response = await client.catalog.search({
                objectTypes: ["CATEGORY"],
            });
        } else {
            response = await Category.find();
        }

        return res.status(200).json({
            message: 'Categories obtained successfully',
            source: source,
            data: JSON.parse(JSON.stringify(response, bigIntReplacer)),
        });
    } catch (error) {
        console.error('Error listing categories:', error);
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;
