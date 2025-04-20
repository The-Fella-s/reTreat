// backend/models/Waiver.js
const mongoose = require("mongoose");

const WaiverSchema = new mongoose.Schema({
  waiverType: { type: String, enum: ["massage","wax","skin","browlash"], required: true },
  formData: { type: mongoose.Schema.Types.Mixed, required: true },
  dateSigned: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending","approved","rejected"], default: "pending" }
});

module.exports = mongoose.model("Waiver", WaiverSchema);
