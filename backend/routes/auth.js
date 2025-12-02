const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  resetPassword
} = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validators');

// Signup route with validation
router.post('/signup', validateSignup, signup);

// Login route with validation
router.post('/login', validateLogin, login);

// Reset password route
router.post('/reset-password', resetPassword);

module.exports = router;

