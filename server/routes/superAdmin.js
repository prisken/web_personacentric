const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateToken, requireSuperAdminOnly } = require('../middleware/auth');
const { User, PointTransaction, PaymentTransaction } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// User Management Routes - Simplified and Robust
router.get('/users', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { category, search, page = 1, limit = 100 } = req.query;
    
    console.log('🔍 Super Admin API called with params:', { category, search, page, limit });
    
    // Build where clause for filtering - EXCLUDE soft-deleted users
    let whereClause = {
      // Exclude soft-deleted users (those with deleted_ prefix in email)
      email: {
        [Op.notLike]: 'deleted_%'
      }
    };
    
    // Category filtering
    if (category && category !== 'all') {
      whereClause.role = category;
    }
    
    // Search filtering
    if (search && search.trim()) {
      whereClause[Op.and] = [
        whereClause, // Keep existing conditions
        {
          [Op.or]: [
            { email: { [Op.iLike]: `%${search}%` } },
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
            { phone: { [Op.iLike]: `%${search}%` } }
          ]
        }
      ];
      // Remove the email condition from the main whereClause since it's now in Op.and
      delete whereClause.email;
    }
    
    const offset = (page - 1) * limit;
    
    console.log('🔍 Where clause:', JSON.stringify(whereClause, null, 2));
    
    // Get users with explicit ordering and no hidden filters
    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 'email', 'first_name', 'last_name', 'phone', 'role', 
        'points', 'subscription_status', 'is_verified',
        'permissions', 'is_system_admin', 'created_at', 'updated_at'
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
      raw: false // Ensure we get full model instances
    });
    
    console.log(`📊 Found ${users.count} total users, returning ${users.rows.length} users`);
    
    // Get category counts - EXCLUDE soft-deleted users
    const categoryCounts = await User.findAll({
      where: {
        email: {
          [Op.notLike]: 'deleted_%'
        }
      },
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });
    
    const counts = {
      all: users.count,
      admin: 0,
      agent: 0,
      client: 0,
      super_admin: 0
    };
    
    categoryCounts.forEach(cat => {
      counts[cat.role] = parseInt(cat.count);
    });
    
    console.log('📈 Category counts:', counts);
    
    res.json({
      success: true,
      users: users.rows,
      pagination: {
        total: users.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(users.count / limit)
      },
      categoryCounts: counts
    });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
      details: error.message
    });
  }
});

router.post('/users', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, permissions } = req.body;
    
    const user = await User.create({
      email,
      password_hash: await bcrypt.hash(password, 10),
      first_name,
      last_name,
      role,
      permissions,
      created_by_super_admin: req.user.id,
      is_verified: true
    });
    
    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

router.put('/users/:userId/role', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, permissions } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    await user.update({
      role,
      permissions,
      updated_at: new Date()
    });
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    });
  }
});

// Update user details route
router.put('/users/:userId', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const { first_name, last_name, email, phone, subscription_status, points } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }
    
    const updateData = {
      updated_at: new Date()
    };
    
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (subscription_status !== undefined) updateData.subscription_status = subscription_status;
    if (points !== undefined) updateData.points = points;
    
    await user.update(updateData);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role,
        subscription_status: user.subscription_status,
        points: user.points
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

router.delete('/users/:userId', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const { confirmation, reason } = req.body;
    
    // Safety check: require confirmation
    if (!confirmation || confirmation !== 'DELETE_USER_CONFIRMED') {
      return res.status(400).json({
        success: false,
        error: 'Confirmation required. Please confirm deletion with proper confirmation code.'
      });
    }
    
    // Safety check: require reason
    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Deletion reason is required (minimum 10 characters)'
      });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Safety check: prevent deletion of super admins
    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete super admin users'
      });
    }
    
    // Safety check: prevent self-deletion
    if (user.id === req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }
    
    // Log the deletion for audit trail
    console.log(`User deletion: ${user.email} (${user.role}) deleted by ${req.user.email} at ${new Date().toISOString()}. Reason: ${reason}`);
    
    // Instead of hard delete, mark as deleted (soft delete approach)
    await user.update({
      email: `deleted_${Date.now()}_${user.email}`,
      first_name: 'Deleted',
      last_name: 'User',
      phone: null,
      is_verified: false,
      subscription_status: 'inactive',
      permissions: { deleted: true, deleted_at: new Date().toISOString(), deleted_by: req.user.id, deletion_reason: reason }
    });
    
    res.json({
      success: true,
      message: 'User account deactivated successfully',
      deletedUser: {
        id: user.id,
        originalEmail: user.email,
        deletedAt: new Date().toISOString(),
        deletedBy: req.user.email,
        reason: reason
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// Point Management Routes
router.get('/points/transactions', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const transactions = await PointTransaction.findAll({
      include: [{
        model: User,
        attributes: ['id', 'email', 'first_name', 'last_name']
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      transactions: transactions
    });
  } catch (error) {
    console.error('Get point transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get point transactions'
    });
  }
});

router.post('/points/award', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { userId, points, reason } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    await PointTransaction.create({
      user_id: userId,
      points: points,
      transaction_type: 'AWARD',
      description: reason,
      created_by: req.user.id
    });
    
    await user.increment('points', { by: points });
    
    res.json({
      success: true,
      message: 'Points awarded successfully'
    });
  } catch (error) {
    console.error('Award points error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to award points'
    });
  }
});

router.post('/points/deduct', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { userId, points, reason } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (user.points < points) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient points'
      });
    }
    
    await PointTransaction.create({
      user_id: userId,
      points: -points,
      transaction_type: 'DEDUCT',
      description: reason,
      created_by: req.user.id
    });
    
    await user.decrement('points', { by: points });
    
    res.json({
      success: true,
      message: 'Points deducted successfully'
    });
  } catch (error) {
    console.error('Deduct points error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deduct points'
    });
  }
});

// Payment Management Routes
router.get('/payments/transactions', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const transactions = await PaymentTransaction.findAll({
      include: [{
        model: User,
        attributes: ['id', 'email', 'first_name', 'last_name']
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      transactions: transactions
    });
  } catch (error) {
    console.error('Get payment transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment transactions'
    });
  }
});

router.post('/payments/refund', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { transactionId, reason } = req.body;
    
    const transaction = await PaymentTransaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    if (transaction.status === 'REFUNDED') {
      return res.status(400).json({
        success: false,
        error: 'Transaction already refunded'
      });
    }
    
    // Process refund through payment provider
    // ... payment provider specific code ...
    
    await transaction.update({
      status: 'REFUNDED',
      refund_reason: reason,
      refunded_by: req.user.id,
      refunded_at: new Date()
    });
    
    res.json({
      success: true,
      message: 'Payment refunded successfully'
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refund payment'
    });
  }
});

// Admin Management Routes
router.get('/admins', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const admins = await User.findAll({
      where: {
        role: ['admin', 'super_admin']
      },
      attributes: [
        'id', 'email', 'first_name', 'last_name', 'role',
        'permissions', 'is_system_admin', 'created_at'
      ]
    });
    
    res.json({
      success: true,
      admins: admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get admins'
    });
  }
});

router.post('/admins', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { email, password, first_name, last_name, permissions } = req.body;
    
    const admin = await User.create({
      email,
      password_hash: await bcrypt.hash(password, 10),
      first_name,
      last_name,
      role: 'admin',
      permissions,
      created_by_super_admin: req.user.id,
      is_verified: true
    });
    
    res.status(201).json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create admin'
    });
  }
});

router.delete('/admins/:adminId', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const { adminId } = req.params;
    
    const admin = await User.findOne({
      where: {
        id: adminId,
        role: 'admin'
      }
    });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }
    
    // Change role to client instead of deleting
    await admin.update({
      role: 'client',
      permissions: {},
      updated_at: new Date()
    });
    
    res.json({
      success: true,
      message: 'Admin privileges removed successfully'
    });
  } catch (error) {
    console.error('Remove admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove admin'
    });
  }
});

module.exports = router;
