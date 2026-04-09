const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    default: 'Stethoscope'
  },
  color: {
    type: String,
    default: '#6366F1'
  },
  description: String,
  doctorCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Specialty', specialtySchema);
