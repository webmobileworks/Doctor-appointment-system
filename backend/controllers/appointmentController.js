const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const createAppointment = async (req, res) => {
  const { doctorId, date, time, type, symptoms, amount } = req.body;

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      time,
      type,
      symptoms,
      amount: amount || doctor.doctorDetails.fees || 500,
      status: 'pending',
      paymentStatus: 'completed' // Mock successful payment
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get appointments for the logged-in user (patient or doctor)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    } else {
      query.patient = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone gender')
      .populate('doctor', 'name doctorDetails.specialty doctorDetails.image');
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update appointment status (Accept/Reject/Complete)
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor only)
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Ensure it belongs to the doctor
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized for this appointment' });
    }

    appointment.status = status;
    const updated = await appointment.save();
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Upload Prescription
// @route   PUT /api/appointments/:id/prescription
// @access  Private (Doctor only)
const uploadPrescription = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    appointment.prescriptionFile = `/uploads/${req.file.filename}`;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  uploadPrescription
};
