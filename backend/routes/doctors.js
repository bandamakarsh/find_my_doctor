const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const { specialty, pending } = req.query;
        let query = {};
        
        if (pending === 'true') {
            query.isApproved = false;
        } else {
            // Handle newly seeded docs that might not have the field
            query.isApproved = { $ne: false }; 
        }

        if (specialty) {
            // Case insensitive search
            query.specialty = { $regex: new RegExp(specialty, 'i') };
        }
        const doctors = await Doctor.find(query);
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new doctor (for seeding data / admin)
router.post('/', async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        const savedDoctor = await newDoctor.save();
        res.status(201).json(savedDoctor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update doctor profile
router.put('/:id', async (req, res) => {
    try {
        // Prevent changing approval status via PUT
        delete req.body.isApproved;
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Approve a doctor
router.patch('/:id/approve', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
