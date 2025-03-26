const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true },
  quantity: { type: Number, default: 1 },
}, { _id: false });

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema],
    menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Services' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
