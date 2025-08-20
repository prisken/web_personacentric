const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PointTransaction = sequelize.define('PointTransaction', {
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
  transaction_type: {
    type: DataTypes.ENUM('earned', 'spent', 'bonus', 'penalty', 'payment_reward'),
    allowNull: false
  },
  points_amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'blog_posts',
      key: 'id'
    }
  },
  event_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'events',
      key: 'id'
    }
  },
  contest_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'contests',
      key: 'id'
    }
  },
  payment_transaction_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'payment_transactions',
      key: 'id'
    }
  },
  quiz_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'quizzes',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  tableName: 'point_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['transaction_type']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['payment_transaction_id']
    }
  ]
});

module.exports = PointTransaction; 