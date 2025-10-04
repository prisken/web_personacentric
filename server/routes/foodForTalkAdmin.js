const express = require('express');
const { v4: uuidv4 } = require('uuid');
const FoodForTalkUser = require('../models/FoodForTalkUser');
const FoodForTalkChatMessage = require('../models/FoodForTalkChatMessage');
const FoodForTalkProfileView = require('../models/FoodForTalkProfileView');

const router = express.Router();

// Generate a 6-digit passkey
const generatePasskey = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get all participants (admin only)
router.get('/participants', async (req, res) => {
  try {
    // Select a conservative set of columns that exist in production
    const participants = await FoodForTalkUser.findAll({
      attributes: [
        'id','email','first_name','last_name','phone','age','occupation','bio','interests','dietary_restrictions','profile_photo_url','secret_passkey','is_verified','is_active','created_at'
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ participants });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ message: 'Failed to get participants' });
  }
});

// Get participant by ID
router.get('/participants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await FoodForTalkUser.findByPk(id, {
      attributes: [
        'id','email','first_name','last_name','phone','age','occupation','bio','interests','dietary_restrictions','profile_photo_url','secret_passkey','is_verified','is_active','created_at'
      ]
    });

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    res.json({ participant });
  } catch (error) {
    console.error('Get participant error:', error?.message, error?.stack);
    res.status(500).json({ message: 'Failed to get participant' });
  }
});

// Toggle participant status
router.patch('/participants/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const participant = await FoodForTalkUser.findByPk(id);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    await participant.update({ is_active: isActive });

    res.json({ message: 'Participant status updated successfully' });
  } catch (error) {
    console.error('Toggle participant status error:', error);
    res.status(500).json({ message: 'Failed to update participant status' });
  }
});

// Regenerate passkey for participant
router.patch('/participants/:id/regenerate-passkey', async (req, res) => {
  try {
    const { id } = req.params;

    const participant = await FoodForTalkUser.findByPk(id);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    const newPasskey = generatePasskey();
    await participant.update({ secret_passkey: newPasskey });

    res.json({ 
      message: 'New passkey generated successfully',
      passkey: newPasskey
    });
  } catch (error) {
    console.error('Regenerate passkey error:', error);
    res.status(500).json({ message: 'Failed to regenerate passkey' });
  }
});

// Delete participant
router.delete('/participants/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const participant = await FoodForTalkUser.findByPk(id);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Delete related data
    await FoodForTalkChatMessage.destroy({ where: { sender_id: id } });
    await FoodForTalkChatMessage.destroy({ where: { recipient_id: id } });
    await FoodForTalkProfileView.destroy({ where: { viewer_id: id } });
    await FoodForTalkProfileView.destroy({ where: { viewed_user_id: id } });

    // Delete participant
    await participant.destroy();

    res.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    console.error('Delete participant error:', error);
    res.status(500).json({ message: 'Failed to delete participant' });
  }
});

// Get chat messages
router.get('/chat-messages', async (req, res) => {
  try {
    const { limit = 100, offset = 0, conversationId } = req.query;

    let whereClause = {};
    if (conversationId) {
      whereClause.conversation_id = conversationId;
    }

    const messages = await FoodForTalkChatMessage.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: FoodForTalkUser,
          as: 'sender',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: FoodForTalkUser,
          as: 'recipient',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Failed to get chat messages' });
  }
});

// Get profile views
router.get('/profile-views', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const profileViews = await FoodForTalkProfileView.findAll({
      order: [['viewed_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: FoodForTalkUser,
          as: 'viewer',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: FoodForTalkUser,
          as: 'viewedUser',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    res.json({ profileViews });
  } catch (error) {
    console.error('Get profile views error:', error);
    res.status(500).json({ message: 'Failed to get profile views' });
  }
});

// Get comprehensive statistics
router.get('/statistics', async (req, res) => {
  try {
    const totalParticipants = await FoodForTalkUser.count();
    const activeParticipants = await FoodForTalkUser.count({ where: { is_active: true } });
    const verifiedParticipants = await FoodForTalkUser.count({ where: { is_verified: true } });
    const participantsWithPasskeys = await FoodForTalkUser.count({ 
      where: { secret_passkey: { [require('sequelize').Op.ne]: null } }
    });

    const totalMessages = await FoodForTalkChatMessage.count();
    const publicMessages = await FoodForTalkChatMessage.count({ where: { message_type: 'public' } });
    const privateMessages = await FoodForTalkChatMessage.count({ where: { message_type: 'private' } });

    const totalProfileViews = await FoodForTalkProfileView.count();

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await FoodForTalkUser.count({
      where: {
        created_at: {
          [require('sequelize').Op.gte]: sevenDaysAgo
        }
      }
    });

    // Age distribution
    const ageStats = await FoodForTalkUser.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        'age'
      ],
      group: ['age'],
      order: [['age', 'ASC']]
    });

    res.json({
      participants: {
        total: totalParticipants,
        active: activeParticipants,
        verified: verifiedParticipants,
        withPasskeys: participantsWithPasskeys,
        recentRegistrations
      },
      messages: {
        total: totalMessages,
        public: publicMessages,
        private: privateMessages
      },
      profileViews: totalProfileViews,
      ageDistribution: ageStats
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Failed to get statistics' });
  }
});

// Export participants data
router.get('/export/participants', async (req, res) => {
  try {
    const participants = await FoodForTalkUser.findAll({
      attributes: [
        'first_name', 'last_name', 'email', 'phone', 'age', 'occupation',
        'bio', 'interests', 'dietary_restrictions', 'emergency_contact_name',
        'emergency_contact_phone', 'is_verified', 'is_active', 'created_at',
        'last_login'
      ],
      order: [['created_at', 'DESC']]
    });

    // Convert to CSV format
    const csvHeader = [
      'First Name', 'Last Name', 'Email', 'Phone', 'Age', 'Occupation',
      'Bio', 'Interests', 'Dietary Restrictions', 'Emergency Contact',
      'Emergency Phone', 'Verified', 'Active', 'Registration Date', 'Last Login'
    ].join(',');

    const csvRows = participants.map(participant => [
      participant.first_name,
      participant.last_name,
      participant.email,
      participant.phone || '',
      participant.age,
      participant.occupation,
      `"${participant.bio.replace(/"/g, '""')}"`,
      `"${(participant.interests || []).join('; ')}"`,
      `"${participant.dietary_restrictions || ''}"`,
      participant.emergency_contact_name,
      participant.emergency_contact_phone,
      participant.is_verified ? 'Yes' : 'No',
      participant.is_active ? 'Yes' : 'No',
      participant.created_at.toISOString().split('T')[0],
      participant.last_login ? participant.last_login.toISOString().split('T')[0] : 'Never'
    ].join(','));

    const csvContent = [csvHeader, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="food-for-talk-participants.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Export participants error:', error);
    res.status(500).json({ message: 'Failed to export participants' });
  }
});

module.exports = router;
