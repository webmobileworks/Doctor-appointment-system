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
      .populate('doctor', 'name doctorDetails.specialty doctorDetails.image')
      .lean();
    
    // Attach standalone reviews dynamically
    const Review = require('../models/Review');
    const reviews = await Review.find({ [req.user.role === 'doctor' ? 'doctor' : 'patient']: req.user.id });
    
    appointments.forEach(apt => {
      const review = reviews.find(r => r.appointment.toString() === apt._id.toString());
      if (review) {
        apt.review = review;
      }
    });

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

    if (!req.file && !req.body.diagnosis) {
      return res.status(400).json({ message: 'Please upload a file or provide diagnosis notes' });
    }
    
    if (req.file) {
      appointment.prescriptionFile = `/uploads/${req.file.filename}`;
    }
    
    if (req.body.diagnosis) {
      appointment.diagnosis = req.body.diagnosis;
    }

    // Auto-complete the appointment when prescription is added
    appointment.status = 'completed';
    
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add review to completed appointment
// @route   POST /api/appointments/:id/review
// @access  Private (Patient only)
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed appointments' });
    }

    const Review = require('../models/Review');
    const existingReview = await Review.findOne({ appointment: req.params.id });

    if (existingReview) {
      return res.status(400).json({ message: 'Already reviewed' });
    }

    const newReview = await Review.create({
      appointment: appointment._id,
      doctor: appointment.doctor,
      patient: appointment.patient,
      rating: Number(rating),
      comment
    });

    // Recalculate doctor's aggregate rating using independent schema
    const reviewedAppts = await Review.find({ doctor: appointment.doctor });

    const totalRatings = reviewedAppts.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = totalRatings / reviewedAppts.length;

    await User.findByIdAndUpdate(appointment.doctor, {
      'doctorDetails.rating': Number(avgRating.toFixed(1)),
      'doctorDetails.reviewCount': reviewedAppts.length
    });

    res.json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  uploadPrescription,
  addReview
};
