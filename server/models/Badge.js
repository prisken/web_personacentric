const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('movie', 'restaurant', 'gift', 'book', 'event', 'app', 'general'),
    allowNull: false
  },
  requirement_type: {
    type: DataTypes.ENUM('count', 'streak', 'points', 'engagement'),
    allowNull: false
  },
  requirement_value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  points_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'badges',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['requirement_type']
    },
    {
      fields: ['is_active']
    }
  ]
});

module.exports = Badge; 