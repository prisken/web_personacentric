'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('agents', 'areas_of_expertise', { type: Sequelize.JSON });
    await queryInterface.addColumn('agents', 'languages', { type: Sequelize.JSON });
    await queryInterface.addColumn('agents', 'preferred_client_types', { type: Sequelize.JSON });
    await queryInterface.addColumn('agents', 'communication_modes', { type: Sequelize.JSON });
    await queryInterface.addColumn('agents', 'availability', { type: Sequelize.TEXT });
    await queryInterface.addColumn('agents', 'location', { type: Sequelize.STRING });
    await queryInterface.addColumn('agents', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'active', 'inactive'),
      defaultValue: 'pending'
    });
    await queryInterface.addColumn('agents', 'in_matching_pool', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('agents', 'areas_of_expertise');
    await queryInterface.removeColumn('agents', 'languages');
    await queryInterface.removeColumn('agents', 'preferred_client_types');
    await queryInterface.removeColumn('agents', 'communication_modes');
    await queryInterface.removeColumn('agents', 'availability');
    await queryInterface.removeColumn('agents', 'location');
    await queryInterface.removeColumn('agents', 'status');
    await queryInterface.removeColumn('agents', 'in_matching_pool');
  }
}; 