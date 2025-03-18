const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        pricing: { type: Number, required: true },
        duration: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        squareId: { type: String },
        variantName: [String],
        variantId: [String],
        variantPricing: [Number],
        variantDuration: [String],
    },
    {
        timestamps: true
    }
);

const services = mongoose.model('Services', servicesSchema);

module.exports = services;
