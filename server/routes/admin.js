const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { User, Agent } = require('../models');
const createQuizTablesProduction = require('../createQuizTablesProduction');

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  next();
};

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'subscription_status'],
      include: [
        { model: Agent, as: 'agent', required: false }
      ],
      order: [['created_at', 'DESC']]
    });

    // Convert to plain objects to avoid serialization issues
    const plainUsers = users.map(u => u.get({ plain: true }));

    res.json({
      success: true,
      users: plainUsers
    });
  } catch (error) {
    console.error('Get users error:', error.stack || error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Update user role (admin only)
router.put('/users/:userId/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'agent', 'client'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.update({ role });

    res.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    });
  }
});

// Seed placeholder data (admin only)
router.post('/seed-data', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Manual seeding triggered by admin...');
    const seedData = require('../seedData');
    await seedData();
    
    res.json({
      success: true,
      message: 'Placeholder data seeded successfully'
    });
  } catch (error) {
    console.error('Manual seeding error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed data',
      details: error.message
    });
  }
});

// Delete user (admin only)
router.delete('/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// Generate access code (admin only)
router.post('/access-codes/generate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Generate a random access code
    const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    res.json({
      success: true,
      data: {
        code: accessCode,
        created_at: new Date()
      }
    });
  } catch (error) {
    console.error('Generate access code error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate access code'
    });
  }
});

// Create quiz tables in production (admin only)
router.post('/create-quiz-tables', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

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

module.exports = router; 