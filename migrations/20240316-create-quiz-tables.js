const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create quizzes table
    await queryInterface.createTable('quizzes', {
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
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
        defaultValue: 70
      },
      questions: {
        type: DataTypes.JSON,
        allowNull: false
      },
      scoring_rules: {
        type: DataTypes.JSON,
        allowNull: true
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create quiz_attempts table
    await queryInterface.createTable('quiz_attempts', {
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quiz_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'quizzes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      max_score: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
      },
      points_earned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      answers: {
        type: DataTypes.JSON,
        allowNull: false
      },
      time_taken: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('quizzes', ['is_active']);
    await queryInterface.addIndex('quizzes', ['category']);
    await queryInterface.addIndex('quizzes', ['difficulty']);
    await queryInterface.addIndex('quiz_attempts', ['user_id']);
    await queryInterface.addIndex('quiz_attempts', ['quiz_id']);
    await queryInterface.addIndex('quiz_attempts', ['completed']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('quiz_attempts');
    await queryInterface.dropTable('quizzes');
  }
}; 