const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Get queue status for a specific doctor
router.get('/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // All of today's appointments for this doctor
        const todaysAppointments = await Appointment.find({
            doctorId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ tokenNumber: 1 });

        // Find the currently consulting token
        const consultingAppointment = todaysAppointments.find(app => app.status === 'consulting');
        const currentToken = consultingAppointment ? consultingAppointment.tokenNumber : null;

        // Waiting appointments
        const waitingAppointments = todaysAppointments.filter(app => app.status === 'waiting');
        const waitingCount = waitingAppointments.length;

        // Fetch doctor info for average consultation time
        const doctor = await Doctor.findById(doctorId);
        const avgConsultationTime = doctor ? doctor.averageConsultationTime : 10; // default 10 mins

        // Calculate estimated wait time based on patients ahead 
        // Note: For a specific patient, it would be (patientToken - currentToken) * avgConsultationTime
        // Here we just return the general queue stats
        
        res.json({
            activeToken: currentToken,
            waitingCount: waitingCount,
            avgConsultationTime: avgConsultationTime,
            appointments: todaysAppointments // We can return the array so frontend can calculate context for specific patients
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
