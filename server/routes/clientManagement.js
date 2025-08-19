const express = require('express');
const router = express.Router();
const { User, EventRegistration, PointTransaction, Event } = require('../models');
// const { ClientRelationship } = require('../models'); // Temporarily commented out for debugging
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get agent's clients
router.get('/clients', auth, async (req, res) => {
  try {
    // Only allow agents to access this endpoint
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can access client management'
      });
    }

    // Temporarily return empty data for debugging
    res.json({
      success: true,
      relationships: []
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
router.get('/clients/:clientId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can access client management'
      });
    }

    // Temporarily return error for debugging
    res.status(404).json({
      success: false,
      error: 'Client relationship not found'
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
router.post('/clients', auth, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can add clients'
      });
    }

    // Temporarily return error for debugging
    res.status(500).json({
      success: false,
      error: 'Client management temporarily disabled'
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
router.put('/clients/:clientId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can update client relationships'
      });
    }

    // Temporarily return error for debugging
    res.status(500).json({
      success: false,
      error: 'Client management temporarily disabled'
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
router.delete('/clients/:clientId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can remove client relationships'
      });
    }

    // Temporarily return error for debugging
    res.status(500).json({
      success: false,
      error: 'Client management temporarily disabled'
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
router.get('/clients/:clientId/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        error: 'Only agents can access client statistics'
      });
    }

    // Temporarily return error for debugging
    res.status(500).json({
      success: false,
      error: 'Client management temporarily disabled'
    });
  } catch (error) {
    console.error('Get client stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch client statistics'
    });
  }
});

module.exports = router; 