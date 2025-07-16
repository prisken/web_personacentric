const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AccessCode = sequelize.define('AccessCode', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(6),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
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
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'access_codes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['code']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['is_used']
    },
    {
      fields: ['expires_at']
    }
  ]
});

module.exports = AccessCode; 