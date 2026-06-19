const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);

// Protected Routes
router.get('/me', protect, authController.getProfile);

module.exports = router;
