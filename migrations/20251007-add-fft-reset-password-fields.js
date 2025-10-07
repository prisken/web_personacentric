'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = 'food_for_talk_users';
    const desc = await queryInterface.describeTable(table);
    if (!desc.reset_password_token) {
      await queryInterface.addColumn(table, 'reset_password_token', { type: Sequelize.STRING(255), allowNull: true });
    }
    if (!desc.reset_password_expires) {
      await queryInterface.addColumn(table, 'reset_password_expires', { type: Sequelize.DATE, allowNull: true });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = 'food_for_talk_users';
    const desc = await queryInterface.describeTable(table);
    if (desc.reset_password_token) {
      await queryInterface.removeColumn(table, 'reset_password_token');
    }
    if (desc.reset_password_expires) {
      await queryInterface.removeColumn(table, 'reset_password_expires');
    }
  }
};


