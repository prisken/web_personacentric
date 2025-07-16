const express = require('express');
const router = express.Router();

// Get all blogs
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// Get blog by ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: {}
  });
});

module.exports = router; 