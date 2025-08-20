const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
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
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  max_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
  },
  time_limit: {
    type: DataTypes.INTEGER, // in minutes, null for no limit
    allowNull: true
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  passing_score: {
    type: DataTypes.INTEGER, // percentage to pass
    defaultValue: 70
  },
  questions: {
    type: DataTypes.JSON, // Array of question objects
    allowNull: false
  },
  scoring_rules: {
    type: DataTypes.JSON, // Custom scoring rules
    allowNull: true
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  external_quiz_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL to external quiz platform'
  },
  quiz_type: {
    type: DataTypes.STRING(20),
    defaultValue: 'internal'
  },
  external_quiz_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'External quiz platform ID'
  },
  point_calculation_method: {
    type: DataTypes.STRING(20),
    defaultValue: 'percentage'
  },
  min_score_for_points: {
    type: DataTypes.INTEGER,
    defaultValue: 70,
    comment: 'Minimum score percentage to earn points'
  }
}, {
  tableName: 'quizzes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Quiz; 