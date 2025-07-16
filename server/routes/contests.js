const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get all contests
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// Get contest by ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: {}
  });
});

// Submit contest entry
router.post('/:id/submit', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Entry submitted successfully'
  });
});

module.exports = router; 