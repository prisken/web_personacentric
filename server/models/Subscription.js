const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Subscription = sequelize.define('Subscription', {
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
  stripe_subscription_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  stripe_customer_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  plan_type: {
    type: DataTypes.ENUM('monthly', 'yearly'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'canceled', 'past_due', 'unpaid'),
    allowNull: false
  },
  current_period_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  current_period_end: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancel_at_period_end: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'subscriptions',
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
      fields: ['stripe_subscription_id']
    }
  ]
});

module.exports = Subscription; 