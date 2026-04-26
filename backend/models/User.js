const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    index: true
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
    specialty: { type: String, index: true },
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

userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
