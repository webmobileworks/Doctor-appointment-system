const User = require('../models/User');

// @desc    Get all doctors (with optional search/filter)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  const { search, specialty } = req.query;
  
  let query = { role: 'doctor' };
  
  if (search) {
    query.name = { $regex: search, $options: 'i' }; // simple case-insensitive text search
  }
  
  if (specialty) {
    query['doctorDetails.specialty'] = specialty;
  }

  try {
    const doctors = await User.find(query).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' }).select('-password');
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update Doctor Profile settings
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Merge incoming details
    doctor.name = req.body.name || doctor.name;
    doctor.doctorDetails = {
      ...doctor.doctorDetails.toObject(),
      ...req.body.doctorDetails
    };

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}

// @desc    Get reviews for a specific doctor
// @route   GET /api/doctors/:id/reviews
// @access  Public
const getDoctorReviews = async (req, res) => {
  const Review = require('../models/Review');
  try {
    const reviews = await Review.find({ doctor: req.params.id })
      .populate('patient', 'name')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get unique specialties with doctor counts
// @route   GET /api/doctors/specialties
// @access  Public
const getSpecialties = async (req, res) => {
  const Specialty = require('../models/Specialty');
  try {
    let specialties = await Specialty.find({});
    
    // If no specialties defined in Specialty collection, fall back to aggregation
    if (specialties.length === 0) {
      specialties = await User.aggregate([
        { $match: { role: 'doctor' } },
        { $group: {
            _id: '$doctorDetails.specialty',
            count: { $sum: 1 }
        }},
        { $project: {
            name: '$_id',
            count: 1,
            _id: 0
        }}
      ]);
    } else {
      // Map to include a live count from User collection
      const enriched = await Promise.all(specialties.map(async (s) => {
        const count = await User.countDocuments({ role: 'doctor', 'doctorDetails.specialty': s.name });
        return {
          ...s.toObject(),
          count
        };
      }));
      return res.json(enriched);
    }
    
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get top rated doctors
// @route   GET /api/doctors/top
// @access  Public
const getTopDoctors = async (req, res) => {
  try {
    const topDoctors = await User.find({ role: 'doctor' })
      .sort({ 'doctorDetails.rating': -1 })
      .limit(6)
      .select('-password');
    res.json(topDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorReviews,
  getSpecialties,
  getTopDoctors
};
