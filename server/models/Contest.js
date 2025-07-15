const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Contest = sequelize.define('Contest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  prize_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  max_participants: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  current_participants: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'voting', 'completed'),
    defaultValue: 'draft'
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'contests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['start_date']
    },
    {
      fields: ['end_date']
    },
    {
      fields: ['created_by']
    }
  ]
});

module.exports = Contest; 