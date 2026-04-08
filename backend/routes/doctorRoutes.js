const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, updateDoctorProfile, getDoctorReviews } = require('../controllers/doctorController');
const { protect, doctorOnly } = require('../middleware/auth');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/reviews', getDoctorReviews);
router.put('/profile', protect, doctorOnly, updateDoctorProfile);

module.exports = router;
