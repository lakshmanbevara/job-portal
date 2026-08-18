const express = require('express');
const {
  registerStudent,
  registerCompany,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register-student', registerStudent);
router.post('/register-company', registerCompany);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;
