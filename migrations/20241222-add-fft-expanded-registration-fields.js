'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = 'food_for_talk_users';
    await queryInterface.addColumn(table, 'nickname', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn(table, 'gender', { type: Sequelize.STRING(20), allowNull: true });
    await queryInterface.addColumn(table, 'expect_person_type', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn(table, 'dream_first_date', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn(table, 'dream_first_date_other', { type: Sequelize.STRING(255), allowNull: true });
    await queryInterface.addColumn(table, 'interests_other', { type: Sequelize.STRING(255), allowNull: true });
    await queryInterface.addColumn(table, 'attractive_traits', { type: Sequelize.JSONB, allowNull: true, defaultValue: [] });
    await queryInterface.addColumn(table, 'attractive_traits_other', { type: Sequelize.STRING(255), allowNull: true });
    await queryInterface.addColumn(table, 'japanese_food_preference', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn(table, 'quickfire_magic_item_choice', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn(table, 'quickfire_desired_outcome', { type: Sequelize.STRING(100), allowNull: true });
    await queryInterface.addColumn(table, 'consent_accepted', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
  },

  down: async (queryInterface, Sequelize) => {
    const table = 'food_for_talk_users';
    await queryInterface.removeColumn(table, 'nickname');
    await queryInterface.removeColumn(table, 'gender');
    await queryInterface.removeColumn(table, 'expect_person_type');
    await queryInterface.removeColumn(table, 'dream_first_date');
    await queryInterface.removeColumn(table, 'dream_first_date_other');
    await queryInterface.removeColumn(table, 'interests_other');
    await queryInterface.removeColumn(table, 'attractive_traits');
    await queryInterface.removeColumn(table, 'attractive_traits_other');
    await queryInterface.removeColumn(table, 'japanese_food_preference');
    await queryInterface.removeColumn(table, 'quickfire_magic_item_choice');
    await queryInterface.removeColumn(table, 'quickfire_desired_outcome');
    await queryInterface.removeColumn(table, 'consent_accepted');
  }
};


