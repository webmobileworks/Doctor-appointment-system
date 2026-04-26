const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  consultationId: {
    type: String, // could be doctorId_patientId or appointmentId
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
