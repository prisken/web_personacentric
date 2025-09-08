'use strict';

const EnumManager = require('../server/utils/enumManager');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔄 Adding super_admin role to enum...');
    
    try {
      const enumManager = new EnumManager();
      
      // Add super_admin to the role enum
      await enumManager.addSuperAdminRole();
      
      console.log('✅ Super admin role added successfully');
    } catch (error) {
      console.error('❌ Failed to add super admin role:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('⚠️  Rolling back super_admin role addition...');
    console.log('Note: PostgreSQL does not support removing enum values directly.');
    console.log('This migration cannot be fully rolled back without manual intervention.');
    
    // We cannot remove enum values in PostgreSQL, so we just log a warning
    console.log('⚠️  Manual cleanup required if you need to remove super_admin role');
  }
};
