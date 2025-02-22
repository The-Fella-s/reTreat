const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentId: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
