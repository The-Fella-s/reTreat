const express = require('express');
const Services = require("../models/Services");
const Category = require('../models/Category');
const { createCategory, deleteCategory } = require('../utilities/helpers/categoryHelpers');
const { SquareClient, SquareEnvironment } = require("square");
const axios = require('axios');
const multer = require("multer");

const router = express.Router();

const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
    userAgentDetail: 'sample_app_node_subscription',
});

// GET all services
router.get('/', async (req, res) => {
  try {
      const services = await Services.find().populate('category', 'name');
      res.status(200).json(services); // Return as JSON format
  } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /check-existence route (moved here so it won't conflict with /:id)
router.get('/check-existence', async (req, res) => {
  try {
      const existingServices = await Services.find().populate('category', 'name');
      if (existingServices.length > 0) {
          return res.json({ exists: true });
      } else {
          return res.json({ exists: false });
      }
  } catch (error) {
      console.error('Error checking existence:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

// GET service by ID
router.get('/:id', async (req, res) => {
    try {
      const service = await Services.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// POST /populate route
router.post('/populate', async (req, res) => {
    try {
        const { services } = req.body;

        const promises = services.map(async (serviceData) => {
            // Always treat the provided category as a name.
            if (serviceData.category) {
                // Find the category document by its name
                let categoryDoc = await Category.findOne({ name: serviceData.category });
                // If not found, create it.
                if (!categoryDoc) {
                    await createCategory(client, serviceData.category);
                    categoryDoc = await Category.findOne({ name: serviceData.category });
                }
                // Set the serviceData category to the category document's _id.
                serviceData.category = categoryDoc._id;
            }

            // Upsert the service into the database.
            await Services.updateOne(
                { name: serviceData.name },
                { $set: serviceData },
                { upsert: true }
            );

            // Retrieve the updated service from the DB.
            const updatedService = await Services.findOne({ name: serviceData.name });
            // Fetch the category document to obtain its name.
            const categoryDoc = await Category.findById(updatedService.category);

            // Build the payload for the /api/catalog/create route.
            const payload = {
                name: updatedService.name,
                description: updatedService.description,
                pricing: updatedService.pricing,
                duration: updatedService.duration,
                category: categoryDoc ? categoryDoc.name : '',
                variantName: updatedService.variantName,
                variantId: updatedService.variantId,
                variantPricing: updatedService.variantPricing,
                variantDuration: updatedService.variantDuration,
                servicePicture: updatedService.servicePicture,
            };

            await axios.post('http://localhost:5000/api/catalogs/create', payload);
        });

        await Promise.all(promises);

        res.status(201).json({ message: 'Services populated successfully' });
    } catch (error) {
        console.error('Error populating services:', error);
        res.status(500).json({ error: 'Error populating services' });
    }
});

// Update a service by its ID and then update its catalog as well
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let updatedService = req.body;

        // Always treat the provided category as a name.
        if (updatedService.category) {
            // Find the category document by its name
            const categoryDoc = await Category.findOne({ name: updatedService.category });
            if (!categoryDoc) {
                return res.status(400).json({ message: 'Category not found' });
            }
            // Replace the category field with the found category's ObjectId
            updatedService.category = categoryDoc._id;
        }

        // Update the service in the database
        const result = await Services.findByIdAndUpdate(id, updatedService, {
            new: true, // Return the updated service
        });

        if (!result) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Prepare data to be sent to the catalogs update API.
        const catalogUpdateData = {
            newName: result.name,
            description: result.description,
            pricing: result.pricing,
            duration: result.duration,
            category: result.category,

            // Optional: Include variant-related fields if they exist
            variantName: result.variantName,
            variantId: result.variantId,
            variantPricing: result.variantPricing,
            variantDuration: result.variantDuration,
        };

        // Call the /api/catalogs/update API endpoint to create it in Square
        const catalogsResponse = await axios.put(
            'http://localhost:5000/api/catalogs/update',
            catalogUpdateData,
            { params: { name: result.name } } // using the updated service's name as the query parameter
        );

        // Return both the updated service and the catalogs update response
        res.status(200).json({
            message: 'Service updated successfully',
            service: result,
            catalogUpdate: catalogsResponse.data,
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Delete a service by its ID and delete the category if it's empty
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the service to be deleted (to retrieve its category)
        const serviceToDelete = await Services.findById(id);
        if (!serviceToDelete) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const categoryId = serviceToDelete.category;

        // Delete the service
        const result = await Services.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Check if any other service is using the same category
        const remainingCount = await Services.countDocuments({ category: categoryId });
        if (remainingCount === 0) {
            // Find the category document by its ID
            const categoryDoc = await Category.findById(categoryId);
            if (categoryDoc) {
                // Delete the category using the helper function
                await deleteCategory(client, categoryDoc.name);
            }
        }

        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/services'); // Save files in uploads/services
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Unique filename
    }
});

const upload = multer({ storage });

// Image upload endpoint
router.post('/upload', upload.single('servicePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Upload to the services folder
        const filePath = `/uploads/services/${req.file.filename}`;
        res.status(200).json({ message: 'File uploaded successfully', filePath });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
