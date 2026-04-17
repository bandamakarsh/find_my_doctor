const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, name: user.name, doctorId: user.doctorId },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone (mocked)
// @access  Public
router.post('/send-otp', async (req, res) => {
    try {
        const { name, phone } = req.body;
        if (!phone) return res.status(400).json({ message: 'Phone number required' });

        // Generate a 6 digit dummy OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins

        // Find or create patient user
        let user = await User.findOne({ phone, role: 'patient' });
        if (!user) {
            user = await User.create({
                phone,
                role: 'patient',
                name: name || 'New Patient', // Default, they can update later
                email: `patient_${phone}@smartop.local` // Prevent unique index collision on null email
            });
        } else if (name) {
            user.name = name;
        }

        // Fix existing users without an email to prevent collision on save
        if (!user.email) {
            user.email = `patient_${phone}@smartop.local`;
        }

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        console.log(`[Mock SMS] Sent OTP ${otp} to phone ${phone}`);
        res.json({ message: 'OTP sent successfully (check backend console!)' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and return token
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP required' });

        const user = await User.findOne({ phone, role: 'patient' });
        
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Clear OTP after successful login
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            token: generateToken(user)
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/register
// @desc    Register a new user (doctor or patient)
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, age, phone, doctorId } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            role,
            age,
            phone
        };

        if (role === 'doctor' && doctorId) {
            userData.doctorId = doctorId;
        }

        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                doctorId: user.doctorId,
                token: generateToken(user)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/register-doctor
// @desc    Register a new doctor (creates Doctor & User)
// @access  Public
router.post('/register-doctor', async (req, res) => {
    try {
        const { 
            name, email, password, phone, 
            specialty, experience, consultationFee, imageUrl, description, hospital, availability
        } = req.body;

        if (!name || !email || !password || !specialty || !experience || !consultationFee || !hospital || !availability) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create the Doctor profile first
        const newDoctor = await Doctor.create({
            name,
            specialty,
            experience: Number(experience),
            consultationFee: Number(consultationFee),
            imageUrl: imageUrl || '',
            description: description || '',
            hospital,
            contact: phone, // Save phone as contact info on the profile explicitly
            availability,
            isApproved: true // Auto-approve to make them available immediately
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the User linking to Doctor profile
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'doctor',
            doctorId: newDoctor._id
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                doctorId: user.doctorId,
                // generate token so they can log in immediately (but maybe dashboard will block actions if not approved?)
                // Actually they should be able to log into dashboard, but maybe queue is empty.
                token: generateToken(user),
                message: 'Doctor registered successfully and is now active.'
            });
        } else {
            // Rollback if needed
            await Doctor.findByIdAndDelete(newDoctor._id);
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Optional: strict role check
            if (role && user.role !== role) {
                return res.status(403).json({ message: `Access denied. Not a ${role}` });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                doctorId: user.doctorId,
                token: generateToken(user),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
