const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Recommendation, RecommendationEngagement, Badge, UserBadge, User, PointTransaction, sequelize } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

// Generate unique share code
const generateShareCode = () => {
  return crypto.randomBytes(10).toString('hex').toUpperCase();
};

// Get user's recommendations (authenticated users)
router.get('/my-recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const recommendations = await Recommendation.findAll({
      where: { user_id: userId },
      include: [
        {
          model: RecommendationEngagement,
          as: 'engagements',
          attributes: ['engagement_type', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      recommendations: recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations'
    });
  }
});

// Get recommendation by share code (public)
router.get('/share/:shareCode', async (req, res) => {
  try {
    const { shareCode } = req.params;

    const recommendation = await Recommendation.findOne({
      where: { share_code: shareCode, status: 'active' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name']
        }
      ]
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }

    // Increment view count
    await recommendation.increment('total_views');

    res.json({
      success: true,
      recommendation: recommendation
    });
  } catch (error) {
    console.error('Get recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendation'
    });
  }
});

// Create new recommendation (authenticated users)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      category,
      name,
      description,
      why_recommend,
      link,
      location,
      photo_url
    } = req.body;

    // Generate unique share code
    let shareCode;
    let isUnique = false;
    while (!isUnique) {
      shareCode = generateShareCode();
      const existing = await Recommendation.findOne({ where: { share_code: shareCode } });
      if (!existing) {
        isUnique = true;
      }
    }

    const recommendation = await Recommendation.create({
      user_id: userId,
      category,
      name,
      description,
      why_recommend,
      link,
      location,
      photo_url,
      share_code: shareCode
    });

    res.json({
      success: true,
      message: 'Recommendation created successfully',
      recommendation: recommendation
    });
  } catch (error) {
    console.error('Create recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create recommendation'
    });
  }
});

// Update recommendation (authenticated users)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

    const recommendation = await Recommendation.findOne({
      where: { id, user_id: userId }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }

    await recommendation.update(updateData);

    res.json({
      success: true,
      message: 'Recommendation updated successfully',
      recommendation: recommendation
    });
  } catch (error) {
    console.error('Update recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update recommendation'
    });
  }
});

// Delete recommendation (authenticated users)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const recommendation = await Recommendation.findOne({
      where: { id, user_id: userId }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }

    await recommendation.destroy();

    res.json({
      success: true,
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    console.error('Delete recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete recommendation'
    });
  }
});

// Engage with recommendation (public)
router.post('/:shareCode/engage', async (req, res) => {
  try {
    const { shareCode } = req.params;
    const { engagement_type, visitor_email, visitor_name, comment } = req.body;

    const recommendation = await Recommendation.findOne({
      where: { share_code: shareCode, status: 'active' }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }

    // Check if this engagement already exists
    const existingEngagement = await RecommendationEngagement.findOne({
      where: {
        recommendation_id: recommendation.id,
        visitor_email,
        engagement_type
      }
    });

    if (existingEngagement) {
      return res.status(400).json({
        success: false,
        error: 'Engagement already recorded'
      });
    }

    // Determine points based on engagement type
    let points = 0;
    switch (engagement_type) {
      case 'view':
        points = 10;
        break;
      case 'tried':
        points = 30;
        break;
      case 'comment':
        points = 30;
        break;
      case 'signup':
        points = 50;
        break;
    }

    // Create engagement record
    const engagement = await RecommendationEngagement.create({
      recommendation_id: recommendation.id,
      visitor_email,
      visitor_name,
      engagement_type,
      comment,
      points_awarded: points,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    // Update recommendation stats
    await recommendation.increment('total_engagements');
    if (engagement_type === 'signup') {
      await recommendation.increment('total_signups');
    }

    // Award points to the recommendation creator
    if (points > 0) {
      await PointTransaction.create({
        user_id: recommendation.user_id,
        transaction_type: 'earned',
        points_amount: points,
        description: `Recommendation engagement: ${engagement_type}`,
        content_id: recommendation.id
      });

      // Update user's points
      await User.increment('points', { by: points, where: { id: recommendation.user_id } });
    }

    res.json({
      success: true,
      message: 'Engagement recorded successfully',
      points_awarded: points,
      engagement: engagement
    });
  } catch (error) {
    console.error('Engage with recommendation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record engagement'
    });
  }
});

// Get user's badges (authenticated users)
router.get('/badges', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const userBadges = await UserBadge.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Badge,
          as: 'badge'
        }
      ],
      order: [['earned_at', 'DESC']]
    });

    // Get all available badges for comparison
    const allBadges = await Badge.findAll({
      where: { is_active: true },
      order: [['requirement_value', 'ASC']]
    });

    res.json({
      success: true,
      userBadges: userBadges,
      allBadges: allBadges
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch badges'
    });
  }
});

// Get leaderboard (public)
router.get('/leaderboard', async (req, res) => {
  try {
    const { period = 'weekly', category } = req.query;

    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    switch (period) {
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    whereClause.created_at = {
      [Op.gte]: startDate
    };

    const leaderboard = await Recommendation.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name']
        }
      ],
      attributes: [
        'user_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'recommendation_count'],
        [sequelize.fn('SUM', sequelize.col('total_engagements')), 'total_engagements'],
        [sequelize.fn('SUM', sequelize.col('total_signups')), 'total_signups']
      ],
      group: ['user_id'],
      order: [[sequelize.fn('SUM', sequelize.col('total_engagements')), 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      leaderboard: leaderboard,
      period: period
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// Get recommendation statistics (authenticated users)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await Recommendation.findAll({
      where: { user_id: userId },
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_views')), 'total_views'],
        [sequelize.fn('SUM', sequelize.col('total_engagements')), 'total_engagements'],
        [sequelize.fn('SUM', sequelize.col('total_signups')), 'total_signups']
      ],
      group: ['category']
    });

    const totalStats = await Recommendation.findOne({
      where: { user_id: userId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_recommendations'],
        [sequelize.fn('SUM', sequelize.col('total_views')), 'total_views'],
        [sequelize.fn('SUM', sequelize.col('total_engagements')), 'total_engagements'],
        [sequelize.fn('SUM', sequelize.col('total_signups')), 'total_signups']
      ]
    });

    res.json({
      success: true,
      categoryStats: stats,
      totalStats: totalStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router; 