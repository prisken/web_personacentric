'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('quizzes', 'external_quiz_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'URL to external quiz platform'
    });

    await queryInterface.addColumn('quizzes', 'quiz_type', {
      type: Sequelize.ENUM('internal', 'external'),
      defaultValue: 'internal'
    });

    await queryInterface.addColumn('quizzes', 'external_quiz_id', {
      type: Sequelize.STRING(100),
      allowNull: true,
      comment: 'External quiz platform ID'
    });

    await queryInterface.addColumn('quizzes', 'point_calculation_method', {
      type: Sequelize.ENUM('percentage', 'fixed', 'custom'),
      defaultValue: 'percentage'
    });

    await queryInterface.addColumn('quizzes', 'min_score_for_points', {
      type: Sequelize.INTEGER,
      defaultValue: 70,
      comment: 'Minimum score percentage to earn points'
    });

    // Add quiz_id to point_transactions
    await queryInterface.addColumn('point_transactions', 'quiz_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'quizzes',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('quizzes', 'external_quiz_url');
    await queryInterface.removeColumn('quizzes', 'quiz_type');
    await queryInterface.removeColumn('quizzes', 'external_quiz_id');
    await queryInterface.removeColumn('quizzes', 'point_calculation_method');
    await queryInterface.removeColumn('quizzes', 'min_score_for_points');
    await queryInterface.removeColumn('point_transactions', 'quiz_id');
  }
}; 