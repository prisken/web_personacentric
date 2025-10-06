'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove emergency contact fields from food_for_talk_users table
    await queryInterface.removeColumn('food_for_talk_users', 'emergency_contact_name');
    await queryInterface.removeColumn('food_for_talk_users', 'emergency_contact_phone');
  },

  async down(queryInterface, Sequelize) {
    // Add back emergency contact fields if migration needs to be rolled back
    await queryInterface.addColumn('food_for_talk_users', 'emergency_contact_name', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('food_for_talk_users', 'emergency_contact_phone', {
      type: Sequelize.STRING(20),
      allowNull: true
    });
  }
};
