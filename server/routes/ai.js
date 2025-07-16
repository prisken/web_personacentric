const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Generate content
router.post('/generate', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      content: 'This is a sample AI-generated content.'
    }
  });
});

module.exports = router; 