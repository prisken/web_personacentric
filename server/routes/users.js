const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Profile updated successfully'
  });
});

module.exports = router; 