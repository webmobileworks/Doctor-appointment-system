const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllDoctors,
  updateUserStatus,
  getSpecialties,
  addSpecialty,
  deleteSpecialty
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Protected admin routes
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/doctors', protect, adminOnly, getAllDoctors);
router.put('/users/:id/status', protect, adminOnly, updateUserStatus);
router.get('/specialties', protect, adminOnly, getSpecialties);
router.post('/specialties', protect, adminOnly, addSpecialty);
router.delete('/specialties/:id', protect, adminOnly, deleteSpecialty);

module.exports = router;
