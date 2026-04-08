const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, updateDoctorProfile } = require('../controllers/doctorController');
const { protect, doctorOnly } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/profile', protect, doctorOnly, updateDoctorProfile);

module.exports = router;
