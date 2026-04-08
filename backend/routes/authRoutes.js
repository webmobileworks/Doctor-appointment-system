const express = require('express');
const router = express.Router();
const { registerUser, authUser, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
