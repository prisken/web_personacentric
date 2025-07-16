const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Create payment
router.post('/create', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Payment created successfully'
  });
});

// Get payment history
router.get('/history', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

module.exports = router; 