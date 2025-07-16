const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContestSubmission = sequelize.define('ContestSubmission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  contest_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'contests',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content_type: {
    type: DataTypes.ENUM('social_media', 'blog_article', 'poster_design', 'video_content', 'email_campaign', 'infographic'),
    allowNull: false
  },
  media_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'winner'),
    defaultValue: 'pending'
  },
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  points_awarded: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  admin_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'contest_submissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['contest_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['content_type']
    }
  ]
});

module.exports = ContestSubmission; 