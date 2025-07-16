const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EventRegistration = sequelize.define('EventRegistration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  event_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'events',
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
  status: {
    type: DataTypes.ENUM('registered', 'attended', 'cancelled', 'no_show'),
    defaultValue: 'registered'
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  attendance_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  points_spent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  tableName: 'event_registrations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['event_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      unique: true,
      fields: ['event_id', 'user_id']
    }
  ]
});

module.exports = EventRegistration; 