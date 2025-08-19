const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClientRelationship = sequelize.define('ClientRelationship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  agent_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'rejected', 'inactive'),
    defaultValue: 'pending'
  },
  requested_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  confirmed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  commission_rate: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0.10
  },
  total_commission: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  relationship_start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_contact_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  client_goals: {
    type: DataTypes.JSON,
    allowNull: true
  },
  risk_tolerance: {
    type: DataTypes.ENUM('conservative', 'moderate', 'aggressive'),
    allowNull: true
  },
  investment_horizon: {
    type: DataTypes.ENUM('short_term', 'medium_term', 'long_term'),
    allowNull: true
  }
}, {
  tableName: 'client_relationships',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['agent_id']
    },
    {
      fields: ['client_id']
    },
    {
      fields: ['status']
    },
    {
      unique: true,
      fields: ['agent_id', 'client_id']
    }
  ]
});

module.exports = ClientRelationship; 