'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔄 Adding permission system fields...');
    
    try {
      // Add permissions column for granular control
      await queryInterface.addColumn('users', 'permissions', {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      });
      console.log('✅ Added permissions column');

      // Add super admin tracking
      await queryInterface.addColumn('users', 'created_by_super_admin', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      });
      console.log('✅ Added created_by_super_admin column');

      // Add system admin flag
      await queryInterface.addColumn('users', 'is_system_admin', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
      console.log('✅ Added is_system_admin column');

      // Add indexes for performance
      await queryInterface.addIndex('users', ['permissions'], {
        name: 'idx_users_permissions'
      });
      console.log('✅ Added permissions index');

      await queryInterface.addIndex('users', ['created_by_super_admin'], {
        name: 'idx_users_created_by_super_admin'
      });
      console.log('✅ Added created_by_super_admin index');

      await queryInterface.addIndex('users', ['is_system_admin'], {
        name: 'idx_users_is_system_admin'
      });
      console.log('✅ Added is_system_admin index');

      console.log('🎉 Permission system fields added successfully!');
      
    } catch (error) {
      console.error('❌ Failed to add permission system fields:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('🔄 Removing permission system fields...');
    
    try {
      // Remove indexes first
      await queryInterface.removeIndex('users', 'idx_users_permissions');
      await queryInterface.removeIndex('users', 'idx_users_created_by_super_admin');
      await queryInterface.removeIndex('users', 'idx_users_is_system_admin');
      console.log('✅ Removed indexes');

      // Remove columns
      await queryInterface.removeColumn('users', 'permissions');
      await queryInterface.removeColumn('users', 'created_by_super_admin');
      await queryInterface.removeColumn('users', 'is_system_admin');
      console.log('✅ Removed columns');

      console.log('🎉 Permission system fields removed successfully!');
      
    } catch (error) {
      console.error('❌ Failed to remove permission system fields:', error.message);
      throw error;
    }
  }
};
