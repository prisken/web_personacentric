const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add OAuth fields to users table (without unique constraint first)
      await queryInterface.addColumn('users', 'google_id', {
        type: DataTypes.STRING(255),
        allowNull: true
      });

      await queryInterface.addColumn('users', 'facebook_id', {
        type: DataTypes.STRING(255),
        allowNull: true
      });

      await queryInterface.addColumn('users', 'provider', {
        type: DataTypes.STRING(50),
        defaultValue: 'local',
        allowNull: false
      });

      // Add indexes for OAuth fields
      await queryInterface.addIndex('users', ['google_id']);
      await queryInterface.addIndex('users', ['facebook_id']);
      await queryInterface.addIndex('users', ['provider']);

      console.log('✅ OAuth fields added to users table');
    } catch (error) {
      console.error('❌ Error adding OAuth fields:', error.message);
      // Continue even if some fields already exist
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('users', 'google_id');
      await queryInterface.removeColumn('users', 'facebook_id');
      await queryInterface.removeColumn('users', 'provider');
      console.log('✅ OAuth fields removed from users table');
    } catch (error) {
      console.error('❌ Error removing OAuth fields:', error.message);
    }
  }
};
