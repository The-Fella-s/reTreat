const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
    },
    {
        timestamps: true
    }
);

const cartSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [cartItemSchema],
        total: { type: Number, default: 0 },
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;