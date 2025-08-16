const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to gifts table
    await queryInterface.addColumn('gifts', 'availability_start', {
      type: DataTypes.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('gifts', 'availability_end', {
      type: DataTypes.DATE,
      allowNull: true
    });

    // Update status enum
    await queryInterface.changeColumn('gifts', 'status', {
      type: DataTypes.ENUM('draft', 'active', 'inactive', 'out_of_stock', 'discontinued'),
      defaultValue: 'draft'
    });

    // Create gift_redemptions table
    await queryInterface.createTable('gift_redemptions', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      gift_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'gifts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      points_used: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      redemption_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      notes: {
        type: DataTypes.TEXT,
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

    // Add indexes
    await queryInterface.addIndex('gift_redemptions', ['gift_id']);
    await queryInterface.addIndex('gift_redemptions', ['user_id']);
    await queryInterface.addIndex('gift_redemptions', ['status']);
    await queryInterface.addIndex('gift_redemptions', ['redemption_date']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove gift_redemptions table
    await queryInterface.dropTable('gift_redemptions');

    // Remove new columns from gifts table
    await queryInterface.removeColumn('gifts', 'availability_start');
    await queryInterface.removeColumn('gifts', 'availability_end');

    // Revert status enum
    await queryInterface.changeColumn('gifts', 'status', {
      type: DataTypes.ENUM('active', 'inactive', 'out_of_stock'),
      defaultValue: 'active'
    });
  }
};