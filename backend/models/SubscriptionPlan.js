// models/SubscriptionPlan.js
const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  squarePlanId: { type: String },
  squareVariationId: { type: String },
  amount: { type: Number, default: 0 }, // stored in dollars (Square returns in cents)
  cadence: { type: String, default: 'MONTHLY' } // e.g., MONTHLY, WEEKLY
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
