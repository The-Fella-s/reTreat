const Appointment = require('../models/Appointment');
const Services = require('../models/Services');
const Category = require('../models/Category');
const { createCategory } = require('../utilities/helpers/categoryHelpers'); // adjust path as needed

async function copyAppointments(client) {
    try {
        // Retrieve all appointments
        const appointments = await Appointment.find({});

        for (const app of appointments) {
            // Look for a Category matching the appointment's category (stored as a string)
            let categoryDoc = await Category.findOne({ name: app.category });

            // If no category is found, create one using the provided helper
            if (!categoryDoc) {
                // createCategory will create the category in both Mongo and Square as needed.
                await createCategory(client, app.category);
                // Retrieve the created category from MongoDB.
                categoryDoc = await Category.findOne({ name: app.category });
            }

            // Create a new Services using the data from Appointment.
            // We include variant arrays if they exist, defaulting to empty arrays otherwise.
            const newAppointment = new Services({
                name: app.name,
                description: app.description,
                pricing: app.pricing,
                duration: app.duration,
                category: categoryDoc._id, // Reference to the Category document
                variantName: app.variantName || [],
                variantId: app.variantId || [],
                variantPricing: app.variantPricing || [],
                variantDuration: app.variantDuration || [],
                // Optionally include squareId if it exists:
                squareId: app.squareId || undefined,
            });

            await newAppointment.save();
        }

        console.log('All appointments have been successfully copied.');
    } catch (error) {
        console.error('Error copying appointments:', error);
        throw error;
    }
}

// Export the function if you need to use it in other parts of your application.
module.exports = { copyAppointments };

