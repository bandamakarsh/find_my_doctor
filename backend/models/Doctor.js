const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true }, // in years
    consultationFee: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    averageConsultationTime: { type: Number, default: 10 }, // in minutes
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    hospital: { type: String, required: true, default: 'Independent Clinic' },
    contact: { type: String, required: true, default: '0000000000' },
    availability: { type: String, required: true, default: 'Mon-Fri, 9AM-5PM' },
    isApproved: { type: Boolean, default: false } // Admin approval
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
