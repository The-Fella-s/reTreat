const Services = require('../models/Services'); // Import your model
const Category = require('../models/Category');

async function mapJsonToServices(jsonData) {
    if (!jsonData || !jsonData.catalogObject || !jsonData.catalogObject.itemData) {
        throw new Error("Invalid JSON structure");
    }

    const itemData = jsonData.catalogObject.itemData;

    // Initialize arrays for variants and default values
    let variantName = [];
    let variantId = [];
    let variantPricing = [];
    let variantDuration = [];
    let pricing = 0;
    let duration = "Unknown";

    if (Array.isArray(itemData.variations)) {
        for (let i = 0; i < itemData.variations.length; i++) {
            const variation = itemData.variations[i];
            if (variation && variation.itemVariationData) {
                variantName.push(variation.itemVariationData.name);
                variantId.push(variation.id);

                // Parse pricing: convert from cents to dollars if available
                const price = variation.itemVariationData.priceMoney
                    ? parseInt(variation.itemVariationData.priceMoney.amount, 10) / 100
                    : 0;
                variantPricing.push(price);

                // Storing seconds as strings i.e. "3600"
                const durationStr = variation.itemVariationData.serviceDuration
                variantDuration.push(durationStr);

                // Use first variant's values as the main pricing/duration
                if (i === 0) {
                    pricing = price;
                    duration = durationStr;
                }
            }
        }
    }

    // Fetch category name using Square category ID
    let categoryName = "Uncategorized";
    if (Array.isArray(itemData.categories) && itemData.categories.length > 0) {
        const categorySquareId = itemData.categories[0].id;
        const category = await Category.findOne({ squareId: categorySquareId });

        if (category) {
            categoryName = category.name;
        } else {
            console.warn(`Category with Square ID ${categorySquareId} not found in DB.`);
        }
    }

    // Create and return a new Services instance
    return new Services({
        name: itemData.name,
        description: itemData.descriptionPlaintext || itemData.description || "No description provided",
        pricing,
        duration,
        category: categoryName,
        squareId: jsonData.catalogObject.id,
        variantName,
        variantId,
        variantPricing,
        variantDuration
    });
}

module.exports = mapJsonToServices;
