const express = require('express');
const router = express.Router();
const { authenticateToken, requireSuperAdminOnly } = require('../middleware/auth');
const { User, PointTransaction, PaymentTransaction } = require('../models');

// User Management Routes
router.get('/users', authenticateToken, requireSuperAdminOnly, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        'id', 'email', 'first_name', 'last_name', 'role', 
        'points', 'subscription_status', 'is_verified',
        'permissions', 'is_system_admin', 'created_at'
      ]
    });
    
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users'
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

router.delete('/users/:userId', authenticateToken, requireSuperAdminOnly, async (req, res) => {
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
