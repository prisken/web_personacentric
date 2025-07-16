const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Login
router.post('/login', authController.login);

// Register
router.post('/register', authController.register);

// Get current user
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router; 