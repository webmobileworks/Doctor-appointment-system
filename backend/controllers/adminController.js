const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Specialty = require('../models/Specialty');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments({});
    
    // Calculate total revenue from completed appointments
    const completedAppts = await Appointment.find({ status: 'completed' });
    const totalRevenue = completedAppts.reduce((acc, curr) => acc + (curr.fees || 0), 0);

    // Get monthly trends (last 6 months)
    const stats = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const userCount = await User.countDocuments({
        role: 'patient',
        createdAt: { $gte: monthDate, $lt: nextMonthDate }
      });
      const doctorCount = await User.countDocuments({
        role: 'doctor',
        createdAt: { $gte: monthDate, $lt: nextMonthDate }
      });
      const appointmentCount = await Appointment.countDocuments({
        createdAt: { $gte: monthDate, $lt: nextMonthDate }
      });

      stats.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        users: userCount,
        doctors: doctorCount,
        appointments: appointmentCount
      });
    }

    res.json({
      cards: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        totalRevenue
      },
      monthlyTrends: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users (patients)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'patient' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private (Admin)
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update User Status (Suspend/Activate)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = req.body.status || user.status;
    await user.save();
    res.json({ message: `User status updated to ${user.status}`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all specialties
// @route   GET /api/admin/specialties
// @access  Private (Admin)
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find({});
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add new specialty
// @route   POST /api/admin/specialties
// @access  Private (Admin)
const addSpecialty = async (req, res) => {
  try {
    const { name, icon, description, color } = req.body;
    const specialty = await Specialty.create({ name, icon, description, color });
    res.status(201).json(specialty);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete specialty
// @route   DELETE /api/admin/specialties/:id
// @access  Private (Admin)
const deleteSpecialty = async (req, res) => {
  try {
    await Specialty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Specialty removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllDoctors,
  updateUserStatus,
  getSpecialties,
  addSpecialty,
  deleteSpecialty
};
