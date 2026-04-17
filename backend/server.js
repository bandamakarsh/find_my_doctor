const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // For development, allow all
        methods: ['GET', 'POST', 'PATCH']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req for use in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/queue', require('./routes/queue'));

// Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Patients join a specific doctor's room to get relevant updates
    socket.on('join_doctor_room', (doctorId) => {
        socket.join(`doctor_${doctorId}`);
        console.log(`User ${socket.id} joined room doctor_${doctorId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
