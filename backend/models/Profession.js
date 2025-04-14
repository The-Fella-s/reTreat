const mongoose = require('mongoose');

const professionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
});

module.exports = mongoose.models.Profession || mongoose.model('Profession', professionSchema);
