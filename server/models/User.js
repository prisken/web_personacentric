const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'agent', 'client'),
    defaultValue: 'client'
  },
  language_preference: {
    type: DataTypes.ENUM('en', 'zh-TW'),
    defaultValue: 'zh-TW'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  subscription_status: {
    type: DataTypes.ENUM('active', 'inactive', 'grace_period'),
    defaultValue: 'inactive'
  },
  subscription_end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  grace_period_end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_password_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['role']
    },
    {
      fields: ['subscription_status']
    },
    {
      fields: ['points']
    },
    {
      fields: ['is_verified']
    }
  ]
});

module.exports = User; 