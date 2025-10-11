const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FoodForTalkEventSettings = sequelize.define('FoodForTalkEventSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  event_start_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Event start date and time'
  },
  countdown_header_text: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '距離活動開始還有',
    comment: 'Custom countdown header text'
  },
  is_event_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the event is currently active'
  },
  show_countdown: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether to show countdown timer'
  },
  event_status: {
    type: DataTypes.ENUM('upcoming', 'active', 'completed', 'cancelled'),
    defaultValue: 'upcoming',
    comment: 'Current status of the event'
  }
}, {
  tableName: 'food_for_talk_event_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['event_status']
    },
    {
      fields: ['is_event_active']
    },
    {
      fields: ['show_countdown']
    }
  ]
});

module.exports = FoodForTalkEventSettings;










