'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create client_relationships table
    await queryInterface.createTable('client_relationships', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      agent_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'pending'),
        defaultValue: 'active'
      },
      commission_rate: {
        type: Sequelize.DECIMAL(5, 4),
        allowNull: false,
        defaultValue: 0.10
      },
      total_commission: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      relationship_start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_contact_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      client_goals: {
        type: Sequelize.JSON,
        allowNull: true
      },
      risk_tolerance: {
        type: Sequelize.ENUM('conservative', 'moderate', 'aggressive'),
        allowNull: true
      },
      investment_horizon: {
        type: Sequelize.ENUM('short_term', 'medium_term', 'long_term'),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('client_relationships', ['agent_id']);
    await queryInterface.addIndex('client_relationships', ['client_id']);
    await queryInterface.addIndex('client_relationships', ['status']);
    await queryInterface.addIndex('client_relationships', ['agent_id', 'client_id'], {
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove client_relationships table
    await queryInterface.dropTable('client_relationships');
  }
}; 