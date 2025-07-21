const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecommendationEngagement = sequelize.define('RecommendationEngagement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  recommendation_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'recommendations',
      key: 'id'
    }
  },
  visitor_email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  visitor_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  engagement_type: {
    type: DataTypes.ENUM('view', 'tried', 'comment', 'signup'),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  points_awarded: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'recommendation_engagements',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['recommendation_id']
    },
    {
      fields: ['visitor_email']
    },
    {
      fields: ['engagement_type']
    },
    {
      fields: ['created_at']
    },
    {
      unique: true,
      fields: ['recommendation_id', 'visitor_email', 'engagement_type']
    }
  ]
});

module.exports = RecommendationEngagement; 