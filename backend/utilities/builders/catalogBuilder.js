const { bigIntReplacer } = require("../helpers/replacer");
const { generateIdempotencyKey } = require("../helpers/randomGenerator");
const { parseDurationToSeconds } = require("../conversion");

class SquareItemBuilder {

    // Constructor to construct the necessary JSON
    constructor(name = "Default Name", squareId, description = "", pricing = 0, duration = "", category = null, categoryId = "", version = 0) {
        this.data = {
            id: squareId || "#" + generateIdempotencyKey(),
            type: "ITEM",
            version: BigInt(version),
            itemData: {
                categories: [
                    { id: categoryId }
                ],
                reportingCategory: { id: categoryId },
                abbreviation: name.substring(0, 3).toUpperCase(),
                description: description,
                name: name,
                variations: [],
            },
        };
    }

    // Function to set the item's version, very important
    setItemVersion(version) {
        this.data.version = BigInt(version);
        // Update version for all existing variations, very important
        if (this.data.itemData.variations) {
            this.data.itemData.variations.forEach(variation => {
                variation.version = BigInt(version);
            });
        }
        return this;
    }

    // Function to create a Square Item Builder from a Service
    static fromServices(service) {
        const builder = new SquareItemBuilder(
            service.name,
            service.squareId,
            service.description,
            service.pricing,
            service.duration,
            service.category,
            service.category.squareId
        );

        if (service.variantName && service.variantName.length > 0) {
            for (let i = 0; i < service.variantName.length; i++) {
                // Use variantPricing and variantDuration if available, otherwise fallback to default pricing and duration
                const price = (service.variantPricing && service.variantPricing[i] !== undefined)
                    ? service.variantPricing[i]
                    : service.pricing;
                const duration = (service.variantDuration && service.variantDuration[i])
                    ? service.variantDuration[i]
                    : service.duration;
                builder.addVariation(
                    service.variantName[i],
                    "FIXED_PRICING",
                    price,
                    "USD",
                    duration,
                    service.variantId ? service.variantId[i] : null
                );
            }
        } else {

            // If no variation exists, make a default one that includes the service name
            builder.addVariation(
                service.name,
                "FIXED_PRICING",
                service.pricing,
                "USD",
                service.duration,
                null,
            );
        }

        return builder;
    }

    // Add a variation based on data
    addVariation(name, pricingType = "FIXED_PRICING", price = 0, currency = "USD", service_duration, variantId = null) {
        const variation = {
            id: variantId || "#" + generateIdempotencyKey(),
            type: "ITEM_VARIATION",
            version: BigInt(this.data.version),
            itemVariationData: {
                name,
                priceMoney: {
                    amount: BigInt(price * 100),
                    currency
                },
                pricingType,
                sellable: true,
                // Convert service_duration from "1 hour" to 3600.
                serviceDuration: service_duration ? BigInt(parseDurationToSeconds(service_duration)) : undefined,
                itemId: this.data.id
            }
        };
        this.data.itemData.variations.push(variation);
        return this;
    }

    // Removes a variation by their name
    removeVariation(name) {
        const variations = this.data.itemData.variations;
        for (let i = variations.length - 1; i >= 0; i--) {
            if (variations[i].itemVariationData.name === name) {
                variations.splice(i, 1);
            }
        }
        return this;
    }

    // Update a variation using their Id
    updateVariationById(variantId, price, duration, currency = "USD", pricingType = "FIXED_PRICING", newName) {
        for (let variation of this.data.itemData.variations) {
            if (variation.id === variantId) {
                // If a new name is provided, update it.
                if (newName) {
                    variation.itemVariationData.name = newName;
                }
                // Update pricing if provided.
                if (price !== undefined) {
                    variation.itemVariationData.priceMoney.amount = BigInt(price * 100);
                    variation.itemVariationData.priceMoney.currency = currency;
                    variation.itemVariationData.pricingType = pricingType;
                }
                // Update service duration if provided.
                if (duration) {
                    variation.itemVariationData.serviceDuration = BigInt(parseDurationToSeconds(duration));
                }
                // Ensure version consistency.
                variation.version = BigInt(this.data.version);
                break;
            }
        }
        return this;
    }

    // Update a variation using their name if no Id is provided
    updateVariationByName(currentVariantName, newName, price, duration, currency = "USD", pricingType = "FIXED_PRICING") {
        for (let variation of this.data.itemData.variations) {
            if (variation.itemVariationData.name === currentVariantName) {
                // If a new name is provided, update it.
                if (newName) {
                    variation.itemVariationData.name = newName;
                }
                // Update pricing if provided.
                if (price !== undefined) {
                    variation.itemVariationData.priceMoney.amount = BigInt(price * 100);
                    variation.itemVariationData.priceMoney.currency = currency;
                    variation.itemVariationData.pricingType = pricingType;
                }
                // Update service duration if provided.
                if (duration) {
                    variation.itemVariationData.serviceDuration = BigInt(parseDurationToSeconds(duration));
                }
                // Ensure version consistency.
                variation.version = BigInt(this.data.version);
                break;
            }
        }
        return this;
    }

    // Update the name and abbreviation
    updateName(newName) {
        this.data.itemData.name = newName;
        this.data.itemData.abbreviation = newName.substring(0, 3).toUpperCase();
        return this;
    }

    // Update the description
    updateDescription(newDescription) {
        this.data.itemData.description = newDescription;
        return this;
    }

    // Build method returns the plain JSON object (not a string)
    build() {
        return this.data;
    }

    // Optional: toJSON method for logging purposes
    toJSON() {
        return JSON.stringify(this.data, bigIntReplacer, 2);
    }
}

module.exports = { SquareItemBuilder };
