const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Event, EventRegistration, User, Agent } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const { uploadImage } = require('../utils/imageUpload');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

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

// Middleware to check if user is agent
const requireAgent = (req, res, next) => {
  if (req.user.role !== 'agent') {
    return res.status(403).json({
      success: false,
      error: 'Agent access required'
    });
  }
  next();
};

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const { status = 'published', event_type, limit = 20, offset = 0 } = req.query;
    
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (event_type) {
      whereClause.event_type = event_type;
    }

    const events = await Event.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Agent,
          as: 'agent',
          attributes: ['id', 'specialization', 'experience_years']
        }
      ],
      order: [['start_date', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    });
  }
});

// Get event by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: Agent,
          as: 'agent',
          attributes: ['id', 'specialization', 'experience_years', 'bio']
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Get registration count
    const registrationCount = await EventRegistration.count({
      where: { event_id: id, status: 'registered' }
    });

    res.json({
      success: true,
      event: {
        ...event.toJSON(),
        current_participants: registrationCount
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event'
    });
  }
});

// Register for event (authenticated users)
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if event exists and is published
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        error: 'Event is not available for registration'
      });
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      where: { event_id: id, user_id: userId }
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        error: 'Already registered for this event'
      });
    }

    // Check if event is full
    const registrationCount = await EventRegistration.count({
      where: { event_id: id, status: 'registered' }
    });

    if (event.max_participants && registrationCount >= event.max_participants) {
      return res.status(400).json({
        success: false,
        error: 'Event is full'
      });
    }

    // Create registration
    const registration = await EventRegistration.create({
      event_id: id,
      user_id: userId,
      status: 'registered'
    });

    res.json({
      success: true,
      message: 'Registered successfully',
      registration: registration
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register for event'
    });
  }
});

// Cancel registration (authenticated users)
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const registration = await EventRegistration.findOne({
      where: { event_id: id, user_id: userId, status: 'registered' }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    await registration.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel registration'
    });
  }
});

// Get user's event registrations (authenticated users)
router.get('/user/registrations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await EventRegistration.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['id', 'title', 'description', 'start_date', 'end_date', 'location', 'event_type']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      registrations: registrations
    });
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations'
    });
  }
});

// ADMIN ROUTES
// ============

// Create event with image upload (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      event_type,
      start_date,
      end_date,
      location,
      max_participants,
      price,
      points_reward,
      agent_id
    } = req.body;

    // Handle image upload if provided
    let imageUrl = null;
    if (req.file) {
      // Uploading event image
      const result = await uploadImage(req.file, 'events');
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to upload event image: ' + result.error
        });
      }
      
      imageUrl = result.url;
              // Event image uploaded successfully
    }

    const event = await Event.create({
      title,
      description,
      event_type,
      start_date,
      end_date,
      location,
      max_participants,
      price,
      points_reward,
      agent_id,
      image: imageUrl,
      created_by: req.user.id,
      status: 'published'
    });

    res.json({
      success: true,
      message: 'Event created successfully',
      event: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event'
    });
  }
});

// Update event with image upload (admin only)
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Handle image upload if provided
    if (req.file) {
      // Uploading updated event image
      const result = await uploadImage(req.file, 'events');
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to upload event image: ' + result.error
        });
      }
      
      updateData.image = result.url;
              // Updated event image uploaded successfully
    }

    await event.update(updateData);

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update event'
    });
  }
});

// Delete event (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Check if there are registrations
    const registrationCount = await EventRegistration.count({
      where: { event_id: id }
    });

    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete event with existing registrations'
      });
    }

    await event.destroy();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event'
    });
  }
});

// Get event registrations (admin only)
router.get('/:id/registrations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const registrations = await EventRegistration.findAll({
      where: { event_id: id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email', 'role']
        }
      ],
      order: [['registration_date', 'ASC']]
    });

    res.json({
      success: true,
      registrations: registrations
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations'
    });
  }
});

// Update registration status (admin only)
router.put('/:id/registrations/:registrationId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;

    const registration = await EventRegistration.findByPk(registrationId);
    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    await registration.update({ status });

    res.json({
      success: true,
      message: 'Registration status updated successfully',
      registration: registration
    });
  } catch (error) {
    console.error('Update registration status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update registration status'
    });
  }
});

// AGENT ROUTES
// ============

// Get agent's events (agent only)
router.get('/agent/my-events', authenticateToken, requireAgent, async (req, res) => {
  try {
    const agentId = req.user.id;

    const events = await Event.findAll({
      where: { agent_id: agentId },
      include: [
        {
          model: EventRegistration,
          as: 'registrations',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'first_name', 'last_name', 'email', 'role']
            }
          ]
        }
      ],
      order: [['start_date', 'ASC']]
    });

    res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('Get agent events error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent events'
    });
  }
});

// Add user to event (agent only)
router.post('/:id/add-participant', authenticateToken, requireAgent, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const agentId = req.user.id;

    // Check if event belongs to agent
    const event = await Event.findOne({
      where: { id, agent_id: agentId }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found or not authorized'
      });
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      where: { event_id: id, user_id }
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        error: 'User is already registered for this event'
      });
    }

    // Create registration
    const registration = await EventRegistration.create({
      event_id: id,
      user_id,
      status: 'registered'
    });

    res.json({
      success: true,
      message: 'User added to event successfully',
      registration: registration
    });
  } catch (error) {
    console.error('Add participant error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add participant'
    });
  }
});

// Remove user from event (agent only)
router.delete('/:id/remove-participant/:userId', authenticateToken, requireAgent, async (req, res) => {
  try {
    const { id, userId } = req.params;
    const agentId = req.user.id;

    // Check if event belongs to agent
    const event = await Event.findOne({
      where: { id, agent_id: agentId }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found or not authorized'
      });
    }

    const registration = await EventRegistration.findOne({
      where: { event_id: id, user_id: userId }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }

    await registration.destroy();

    res.json({
      success: true,
      message: 'User removed from event successfully'
    });
  } catch (error) {
    console.error('Remove participant error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove participant'
    });
  }
});

module.exports = router; 