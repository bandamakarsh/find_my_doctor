const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Book a new appointment
router.post('/', async (req, res) => {
    try {
        const { doctorId, patientName, age, phone } = req.body;

        // Calculate token number based on today's appointments for this doctor
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayAppointmentsCount = await Appointment.countDocuments({
            doctorId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        const tokenNumber = todayAppointmentsCount + 1;

        const newAppointment = new Appointment({
            doctorId,
            patientName,
            age,
            phone,
            tokenNumber,
            status: 'waiting'
        });

        const savedAppointment = await newAppointment.save();
        
        // Let the IO instance handle emitting the update
        if (req.io) {
            req.io.to(`doctor_${doctorId}`).emit('queue_updated', { message: 'New appointment booked' });
        }

        res.status(201).json(savedAppointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update appointment status (Admin / Doctor simulation)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // 'waiting', 'consulting', 'completed', 'cancelled'
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        if (req.io) {
            req.io.to(`doctor_${appointment.doctorId}`).emit('queue_updated', { message: `Appointment ${appointment.tokenNumber} status changed to ${status}` });
        }

        res.json(appointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get appointments for a specific patient by phone
router.get('/patient/:phone', async (req, res) => {
    try {
        const appointments = await Appointment.find({ phone: req.params.phone })
            .populate('doctorId', 'name specialty hospital contact')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all appointments for a specific doctor (history)
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.params.doctorId })
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
