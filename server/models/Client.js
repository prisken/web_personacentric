const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  // Quiz answers and preferences (example fields)
  primary_goal: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  investment_timeline: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  risk_tolerance: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  financial_situation: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  communication_pref: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  language_preference: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Add more client-specific fields as needed
}, {
  tableName: 'clients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] }
  ]
});

module.exports = Client; 