const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

// Get dashboard data (all roles)
router.get('/', authenticateToken, dashboardController.getDashboard);

// Get user statistics
router.get('/stats', authenticateToken, dashboardController.getUserStats);

module.exports = router; 