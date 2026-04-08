const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const doctors = [
  {
    phone: '9999999991',
    role: 'doctor',
    name: 'Dr. Sarah Johnson',
    doctorDetails: {
      specialty: 'Cardiology',
      experience: 15,
      rating: 4.9,
      reviewCount: 328,
      fees: 800,
      location: 'Mumbai',
      image: '',
      qualification: 'MBBS, MD (Cardiology), DM',
      about: 'Dr. Sarah Johnson is a highly experienced cardiologist with over 15 years of expertise.',
      languages: ['English', 'Hindi'],
      availableSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:30 PM'],
      nextAvailable: 'Today'
    }
  },
  {
    phone: '9999999992',
    role: 'doctor',
    name: 'Dr. Rajesh Kumar',
    doctorDetails: {
      specialty: 'Orthopedics',
      experience: 12,
      rating: 4.8,
      reviewCount: 256,
      fees: 600,
      location: 'Delhi',
      image: '',
      qualification: 'MBBS, MS (Orthopedics)',
      about: 'Specializing in joint replacement surgery and sports medicine.',
      languages: ['English', 'Hindi', 'Punjabi'],
      availableSlots: ['10:00 AM", "11:00 AM", "02:00 PM", "03:30 PM", "05:00 PM'],
      nextAvailable: 'Today'
    }
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    await User.deleteMany({ role: 'doctor' });
    await User.insertMany(doctors);
    console.log('Data seeded!');
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
