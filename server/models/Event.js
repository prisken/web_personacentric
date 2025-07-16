const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  event_type: {
    type: DataTypes.ENUM('workshop', 'seminar', 'consultation', 'webinar'),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  max_participants: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  current_participants: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  points_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  agent_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'agents',
      key: 'id'
    }
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['start_date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['agent_id']
    },
    {
      fields: ['event_type']
    },
    {
      fields: ['created_by']
    }
  ]
});

module.exports = Event; 