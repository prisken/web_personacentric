const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AgentReview = sequelize.define('AgentReview', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  agent_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'agents',
      key: 'id'
    }
  },
  reviewer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  helpful_votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'agent_reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['agent_id']
    },
    {
      fields: ['reviewer_id']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['is_verified']
    }
  ]
});

module.exports = AgentReview; 