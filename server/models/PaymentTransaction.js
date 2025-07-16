const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentTransaction = sequelize.define('PaymentTransaction', {
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
  subscription_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'subscriptions',
      key: 'id'
    }
  },
  payment_method: {
    type: DataTypes.ENUM('stripe', 'paypal', 'bank_transfer'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'HKD'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  external_payment_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  points_awarded: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reward_processed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  consecutive_failed_payments: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_payment_attempt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'payment_transactions',
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
      fields: ['payment_date']
    },
    {
      fields: ['external_payment_id']
    }
  ]
});

module.exports = PaymentTransaction; 