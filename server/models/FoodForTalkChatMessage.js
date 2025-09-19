const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FoodForTalkChatMessage = sequelize.define('FoodForTalkChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sender_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'food_for_talk_users',
      key: 'id'
    }
  },
  recipient_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'food_for_talk_users',
      key: 'id'
    }
  },
  message_type: {
    type: DataTypes.ENUM('public', 'private', 'system'),
    allowNull: false,
    defaultValue: 'public'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  conversation_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'food_for_talk_chat_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['sender_id']
    },
    {
      fields: ['recipient_id']
    },
    {
      fields: ['message_type']
    },
    {
      fields: ['conversation_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = FoodForTalkChatMessage;
