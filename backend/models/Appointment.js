const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['In-person', 'Video'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  prescriptionFile: String, // URL or path to uploaded PDF prescription
  diagnosis: String // Doctor's notes/diagnosis
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
