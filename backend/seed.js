const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Doctor = require('./models/Doctor');
const User = require('./models/User');

dotenv.config();

const seedDoctors = [
    {
        name: "Dr. Sarah Jenkins",
        specialty: "Dermatologist",
        experience: 10,
        consultationFee: 500,
        rating: 4.8,
        averageConsultationTime: 12,
        description: "Specializes in skin, hair, and nail conditions.",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500"
    },
    {
        name: "Dr. Michael Chen",
        specialty: "Dentist",
        experience: 15,
        consultationFee: 400,
        rating: 4.9,
        averageConsultationTime: 15,
        description: "Expert in cosmetic dentistry and orthodontics.",
        imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500"
    },
    {
        name: "Dr. Emily Taylor",
        specialty: "General Physician",
        experience: 8,
        consultationFee: 300,
        rating: 4.7,
        averageConsultationTime: 8,
        description: "Focuses on general well-being and preventive care.",
        imageUrl: "https://images.unsplash.com/photo-1594824436951-7f126f09bf22?w=500"
    },
    {
        name: "Dr. Rajesh Kumar",
        specialty: "Cardiologist",
        experience: 20,
        consultationFee: 1000,
        rating: 4.9,
        averageConsultationTime: 20,
        description: "Specialist in heart diseases and cardiovascular health.",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500"
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartop').then(async () => {
    console.log("MongoDB connected for seeding");
    await Doctor.deleteMany();
    await User.deleteMany();
    
    const docs = await Doctor.insertMany(seedDoctors);
    console.log("Database seeded with sample doctors");

    // Also create Users for these doctors
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        // Create a simple email from name
        const email = doc.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@smartop.com';
        await User.create({
            name: doc.name,
            email: email,
            password: hashedPassword,
            role: 'doctor',
            doctorId: doc._id
        });
    }

    // Create a demo patient
    await User.create({
        name: 'Demo Patient',
        email: 'patient@smartop.com',
        password: hashedPassword,
        role: 'patient',
        age: 25,
        phone: '1234567890'
    });
    
    console.log("Database seeded with user accounts. Password is 'password123'.");
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
