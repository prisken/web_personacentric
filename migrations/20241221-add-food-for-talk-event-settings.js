'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create food_for_talk_event_settings table
    await queryInterface.createTable('food_for_talk_event_settings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      event_start_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Event start date and time'
      },
      countdown_header_text: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: '距離活動開始還有',
        comment: 'Custom countdown header text'
      },
      is_event_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the event is currently active'
      },
      show_countdown: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: 'Whether to show countdown timer'
      },
      event_status: {
        type: Sequelize.ENUM('upcoming', 'active', 'completed', 'cancelled'),
        defaultValue: 'upcoming',
        comment: 'Current status of the event'
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

    // Add indexes (guard if they already exist)
    try { await queryInterface.addIndex('food_for_talk_event_settings', ['event_status']); } catch (e) { /* ignore if exists */ }
    try { await queryInterface.addIndex('food_for_talk_event_settings', ['is_event_active']); } catch (e) { /* ignore if exists */ }
    try { await queryInterface.addIndex('food_for_talk_event_settings', ['show_countdown']); } catch (e) { /* ignore if exists */ }

    // Insert default settings
    await queryInterface.bulkInsert('food_for_talk_event_settings', [{
      id: require('uuid').v4(),
      event_start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      countdown_header_text: '距離活動開始還有',
      is_event_active: true,
      show_countdown: true,
      event_status: 'upcoming',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('food_for_talk_event_settings');
  }
};


