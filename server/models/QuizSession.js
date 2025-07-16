const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizSession = sequelize.define('QuizSession', {
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
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  personality_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  financial_profile: {
    type: DataTypes.JSON,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'quiz_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = QuizSession; 