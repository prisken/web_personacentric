const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClientUpgrade = sequelize.define('ClientUpgrade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'under_review'),
    defaultValue: 'pending'
  },
  business_background: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  motivation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  experience_level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false
  },
  expected_income: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  target_clients: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  admin_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewed_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  eligibility_met: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'client_upgrades',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['reviewed_by']
    }
  ]
});

module.exports = ClientUpgrade; 