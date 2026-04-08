const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor'],
    default: 'patient'
  },
  name: {
    type: String,
    required: true
  },
  gender: String,
  dob: Date,
  bloodGroup: String,
  
  // Doctor specific fields
  doctorDetails: {
    specialty: String,
    experience: Number,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    fees: Number,
    location: String,
    image: String,
    qualification: String,
    about: String,
    languages: [String],
    availableSlots: [String],
    nextAvailable: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
