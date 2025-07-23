module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clients', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      primary_goal: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      investment_timeline: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      risk_tolerance: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      financial_situation: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      communication_pref: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      language_preference: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    await queryInterface.addIndex('clients', ['user_id']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clients');
  }
}; 