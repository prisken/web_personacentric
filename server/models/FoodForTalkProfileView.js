const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FoodForTalkProfileView = sequelize.define('FoodForTalkProfileView', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  viewer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'food_for_talk_users',
      key: 'id'
    }
  },
  viewed_user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'food_for_talk_users',
      key: 'id'
    }
  },
  viewed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'food_for_talk_profile_views',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['viewer_id']
    },
    {
      fields: ['viewed_user_id']
    },
    {
      fields: ['viewed_at']
    },
    {
      unique: true,
      fields: ['viewer_id', 'viewed_user_id']
    }
  ]
});

module.exports = FoodForTalkProfileView;
