const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    paymentId: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
