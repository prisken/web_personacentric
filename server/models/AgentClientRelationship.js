const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AgentClientRelationship = sequelize.define('AgentClientRelationship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  agent_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'agents',
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
    type: DataTypes.ENUM('prospective', 'active', 'inactive', 'completed'),
    defaultValue: 'prospective'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  commission_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  total_commission: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  last_contact_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'agent_client_relationships',
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

module.exports = AgentClientRelationship; 