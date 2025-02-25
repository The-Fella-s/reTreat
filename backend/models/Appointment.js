const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(          // DON'T MODIFY ORDER
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        pricing: { type: Number, required: true },
        duration: { type: String, required: true },
        category: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
