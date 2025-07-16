const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizResponse = sequelize.define('QuizResponse', {
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
  question_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'quiz_questions',
      key: 'id'
    }
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'quiz_responses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = QuizResponse; 