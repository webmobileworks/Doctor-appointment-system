const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Send OTP to phone number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Mock OTP generation
  const otp = '123456'; 
  console.log(`Sending Mock OTP ${otp} to phone ${phone}`);

  res.status(200).json({ message: 'OTP sent successfully', mockOtp: otp });
};

// @desc    Verify OTP and Login / Register
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { phone, otp, role, name } = req.body; // role & name useful for first-time registration

  if (otp !== '123456') {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  let user = await User.findOne({ phone });

  if (!user) {
    // Register new user
    user = await User.create({
      phone,
      role: role || 'patient',
      name: name || `User ${phone.slice(-4)}`
    });
  }

  res.json({
    _id: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  getMe
};
