const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const createQuizTablesProduction = require('../createQuizTablesProduction');

// Create quiz tables in production (admin only)
router.post('/create-quiz-tables', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await createQuizTablesProduction();
    
    res.json({
      success: true,
      message: 'Quiz tables created successfully'
    });
  } catch (error) {
    console.error('Create quiz tables error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create quiz tables',
      error: error.message
    });
  }
});

// Note: User management, role changes, access codes, and data seeding
// have been moved to super admin routes for security and proper role separation

module.exports = router; 