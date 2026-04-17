const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    phone: { type: String, required: false },
    otp: { type: String, required: false },
    otpExpires: { type: Date, required: false },
    role: { type: String, enum: ['doctor', 'patient'], required: true },
    
    // If role is doctor, linking to the doctor profile
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    
    // Patient specific fields
    age: { type: Number },
    phone: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String },
    address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
