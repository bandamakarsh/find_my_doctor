const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    tokenNumber: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['waiting', 'consulting', 'completed', 'cancelled'], 
        default: 'waiting' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
