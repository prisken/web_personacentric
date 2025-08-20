const express = require('express');
const router = express.Router();
const { User, ClientRelationship, EventRegistration, PointTransaction, Event } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get agent's clients
router.get('/clients', authenticateToken, async (req, res) => {
  try {
    // Debug logging
    console.log('Client management request received:', {
      user: req.user,
      userId: req.user?.userId,
      userRole: req.user?.role
    });

    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can access client management'
      });
    }

    const relationships = await ClientRelationship.findAll({
      where: { agent_id: req.user.id },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      relationships: relationships
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clients'
    });
  }
});

// Get specific client details
router.get('/clients/:clientId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can access client management'
      });
    }

    const { clientId } = req.params;

    // Check if the relationship exists
    const relationship = await ClientRelationship.findOne({
      where: { 
        agent_id: req.user.id,
        client_id: clientId
      },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'created_at', 'points']
        }
      ]
    });

    if (!relationship) {
      return res.status(404).json({
        success: false,
        error: 'Client relationship not found'
      });
    }

    // Get client's recent activities
    const recentActivities = await EventRegistration.findAll({
      where: { user_id: clientId },
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'title', 'start_date']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    // Get client's point transactions
    const pointTransactions = await PointTransaction.findAll({
      where: { user_id: clientId },
      order: [['created_at', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      relationship: relationship,
      recentActivities: recentActivities,
      pointTransactions: pointTransactions
    });
  } catch (error) {
    console.error('Get client details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch client details'
    });
  }
});

// Add new client relationship
router.post('/clients', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can add clients'
      });
    }

    const { client_referral_id, commission_rate, notes, client_goals, risk_tolerance, investment_horizon } = req.body;

    if (!client_referral_id) {
      return res.status(400).json({
        success: false,
        error: 'Client referral ID is required'
      });
    }

    // Find client by their referral client_id
    const client = await User.findOne({
      where: { client_id: client_referral_id, role: 'client' }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found with this referral ID'
      });
    }

    // Check if relationship already exists
    const existingRelationship = await ClientRelationship.findOne({
      where: { agent_id: req.user.id, client_id: client.id }
    });

    if (existingRelationship) {
      return res.status(400).json({
        success: false,
        error: 'Client relationship already exists'
      });
    }

    const relationship = await ClientRelationship.create({
      id: uuidv4(),
      agent_id: req.user.id,
      client_id: client.id,
      commission_rate: commission_rate || 0.10,
      notes,
      client_goals,
      risk_tolerance,
      investment_horizon,
      status: 'pending'
    });

    res.json({
      success: true,
      relationship: relationship
    });
  } catch (error) {
    console.error('Add client error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add client'
    });
  }
});

// Update client relationship
router.put('/clients/:clientId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can update client relationships'
      });
    }

    const { clientId } = req.params;
    const { status, commission_rate, notes, client_goals, risk_tolerance, investment_horizon, last_contact_date } = req.body;

    const relationship = await ClientRelationship.findOne({
      where: { agent_id: req.user.id, client_id: clientId }
    });

    if (!relationship) {
      return res.status(404).json({
        success: false,
        error: 'Client relationship not found'
      });
    }

    await relationship.update({
      status,
      commission_rate,
      notes,
      client_goals,
      risk_tolerance,
      investment_horizon,
      last_contact_date: last_contact_date || new Date()
    });

    res.json({
      success: true,
      relationship: relationship
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update client relationship'
    });
  }
});

// Remove client relationship
router.delete('/clients/:clientId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can remove client relationships'
      });
    }

    const { clientId } = req.params;

    const relationship = await ClientRelationship.findOne({
      where: { agent_id: req.user.id, client_id: clientId }
    });

    if (!relationship) {
      return res.status(404).json({
        success: false,
        error: 'Client relationship not found'
      });
    }

    await relationship.destroy();

    res.json({
      success: true,
      message: 'Client relationship removed successfully'
    });
  } catch (error) {
    console.error('Remove client error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove client relationship'
    });
  }
});

// Get client statistics
router.get('/clients/:clientId/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can access client statistics'
      });
    }

    const { clientId } = req.params;

    // Check if relationship exists
    const relationship = await ClientRelationship.findOne({
      where: { agent_id: req.user.id, client_id: clientId }
    });

    if (!relationship) {
      return res.status(404).json({
        success: false,
        error: 'Client relationship not found'
      });
    }

    // Get client statistics
    const totalEvents = await EventRegistration.count({
      where: { user_id: clientId }
    });

    const totalPoints = await PointTransaction.sum('points_amount', {
      where: { user_id: clientId }
    });

    const recentActivity = await EventRegistration.count({
      where: { 
        user_id: clientId,
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalEvents,
        totalPoints: totalPoints || 0,
        recentActivity,
        relationshipStartDate: relationship.relationship_start_date,
        lastContactDate: relationship.last_contact_date
      }
    });
  } catch (error) {
    console.error('Get client stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch client statistics'
    });
  }
});

// Client endpoints for managing relationships

// Generate/Regenerate client invitation code
router.post('/client/generate-invitation-code', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        error: 'Only clients can generate invitation codes'
      });
    }

    // Generate a new 6-character alphanumeric code
    const newClientId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Update the user's client_id
    await User.update(
      { client_id: newClientId },
      { where: { id: req.user.id } }
    );

    res.json({
      success: true,
      message: '邀請碼已成功生成',
      client_id: newClientId
    });
  } catch (error) {
    console.error('Generate invitation code error:', error);
    res.status(500).json({
      success: false,
      error: '生成邀請碼失敗'
    });
  }
});

// Get client's relationship requests and active relationships
router.get('/client/relationships', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        error: 'Only clients can access this endpoint'
      });
    }

    const relationships = await ClientRelationship.findAll({
      where: { client_id: req.user.id },
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Get user's client_id for sharing
    const user = await User.findByPk(req.user.id, {
      attributes: ['client_id']
    });

    res.json({
      success: true,
      relationships: relationships,
      client_id: user?.client_id
    });
  } catch (error) {
    console.error('Get client relationships error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch relationships'
    });
  }
});

// Confirm/Accept agent relationship
router.post('/client/relationships/:relationshipId/confirm', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        error: 'Only clients can confirm relationships'
      });
    }

    const { relationshipId } = req.params;

    const relationship = await ClientRelationship.findOne({
      where: { 
        id: relationshipId, 
        client_id: req.user.id,
        status: 'pending'
      }
    });

    if (!relationship) {
      return res.status(404).json({
        success: false,
        error: 'Relationship request not found or already processed'
      });
    }

    await relationship.update({
      status: 'active',
      confirmed_at: new Date(),
      relationship_start_date: new Date()
    });

    res.json({
      success: true,
      message: 'Relationship confirmed successfully',
      relationship: relationship
    });
  } catch (error) {
    console.error('Confirm relationship error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm relationship'
    });
  }
});

// Reject agent relationship
router.post('/client/relationships/:relationshipId/reject', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({
        success: false,
        error: 'Only clients can reject relationships'
      });
    }

    const { relationshipId } = req.params;

    const relationship = await ClientRelationship.findOne({
      where: { 
        id: relationshipId, 
        client_id: req.user.id,
        status: 'pending'
      }
    });

    if (!relationship) {
      return res.status(404).json({
        success: false,
        error: 'Relationship request not found or already processed'
      });
    }

    await relationship.update({
      status: 'rejected',
      confirmed_at: new Date()
    });

    res.json({
      success: true,
      message: 'Relationship rejected',
      relationship: relationship
    });
  } catch (error) {
    console.error('Reject relationship error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject relationship'
    });
  }
});

module.exports = router; 