const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus, uploadPrescription } = require('../controllers/appointmentController');
const { protect, doctorOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.post('/', protect, createAppointment);
router.get('/', protect, getAppointments);
router.put('/:id/status', protect, doctorOnly, updateAppointmentStatus);
router.put('/:id/prescription', protect, doctorOnly, upload.single('prescription'), uploadPrescription);

module.exports = router;
