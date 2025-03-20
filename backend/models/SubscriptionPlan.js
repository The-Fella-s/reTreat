// models/SubscriptionPlan.js

const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  // The Square Catalog object IDs
  squarePlanId: { type: String },         // For SUBSCRIPTION_PLAN
  squareVariationId: { type: String },    // For SUBSCRIPTION_PLAN_VARIATION
  amount: { type: Number, default: 0 },   // e.g. 1500 means $15.00 if using "cents"
  cadence: { type: String, default: 'MONTHLY' }, // WEEKLY, MONTHLY, etc.
  // Add anything else relevant for your subscription
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
