// backend/models/Waiver.js
const mongoose = require("mongoose");

const WaiverSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  waiverType: { type: String, required: true },
  formData:    { type: mongoose.Schema.Types.Mixed, required: true },
  dateSigned:  { type: Date, default: Date.now },
  status:      { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  envelopeId:  { type: String }      // ← store the DocuSign envelope ID
});

module.exports = mongoose.model("Waiver", WaiverSchema);
