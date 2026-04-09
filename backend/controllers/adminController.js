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
    
    // Calculate total revenue from non-cancelled appointments
    const allAppts = await Appointment.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = allAppts.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Get Appointment Status Stats
    const statusStats = await Appointment.aggregate([
      { $group: {
          _id: '$status',
          value: { $sum: 1 }
      }}
    ]);
    const statusColors = {
      completed: "hsl(160, 45%, 48%)",
      pending: "hsl(210, 80%, 50%)",
      confirmed: "hsl(280, 60%, 55%)",
      cancelled: "hsl(0, 72%, 55%)",
      rejected: "hsl(30, 80%, 55%)"
    };
    const appointmentStatusStats = statusStats.map(s => ({
      name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
      value: s.value,
      color: statusColors[s._id] || "hsl(210, 20%, 70%)"
    }));

    // Get Recent Activity (Latest 5 appointments)
    const recentActivity = await Appointment.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .then(appts => appts.map(a => ({
        id: a._id,
        patientName: a.patient?.name || 'Unknown',
        doctorName: a.doctor?.name || 'Unknown',
        status: a.status,
        date: a.date,
        time: a.time,
        amount: a.amount,
        createdAt: a.createdAt
      })));

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

    // Get Specialty Distribution
    const specialtyStats = await User.aggregate([
      { $match: { role: 'doctor' } },
      { $group: {
          _id: '$doctorDetails.specialty',
          value: { $sum: 1 }
      }},
      { $project: {
          name: '$_id',
          value: 1,
          _id: 0
      }}
    ]);

    const colors = ["hsl(210, 80%, 50%)", "hsl(160, 45%, 48%)", "hsl(280, 60%, 55%)", "hsl(30, 80%, 55%)", "hsl(350, 65%, 55%)"];
    const specialtyDistribution = specialtyStats.map((s, i) => ({
      ...s,
      color: colors[i % colors.length]
    }));

    // Get Weekly Appointments (Last 7 days)
    const weeklyAppointments = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const start = new Date(d.setHours(0,0,0,0));
      const end = new Date(d.setHours(23,59,59,999));
      
      const count = await Appointment.countDocuments({
        createdAt: { $gte: start, $lt: end }
      });

      weeklyAppointments.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      });
    }

    res.json({
      cards: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        totalRevenue
      },
      monthlyTrends: stats,
      specialtyDistribution,
      weeklyAppointments,
      appointmentStatusStats,
      recentActivity
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

// @desc    Update User/Doctor details
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.status = req.body.status || user.status;

    // If it's a doctor and specialist details are provided
    if (user.role === 'doctor' && req.body.doctorDetails) {
      user.doctorDetails = {
        ...user.doctorDetails,
        ...req.body.doctorDetails
      };
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllDoctors,
  updateUserStatus,
  updateUser,
  getSpecialties,
  addSpecialty,
  deleteSpecialty
};
