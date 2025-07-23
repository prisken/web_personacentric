const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { User, Agent, Client } = require('../models');

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
        { model: Agent, as: 'agent' },
        { model: Client, as: 'client' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Get users error:', error);
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

module.exports = router; 