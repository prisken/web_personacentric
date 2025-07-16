const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.subscription_status === 'suspended') {
      return res.status(403).json({
        success: false,
        error: 'Account suspended'
      });
    }

    req.user = {
      userId: user.id,
      role: user.role,
      email: user.email
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Admin only middleware
const requireAdmin = requireRole(['admin']);

// Agent or Admin middleware
const requireAgentOrAdmin = requireRole(['agent', 'admin']);

// Any authenticated user middleware
const requireAuth = requireRole(['admin', 'agent', 'client']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireAgentOrAdmin,
  requireAuth
}; 