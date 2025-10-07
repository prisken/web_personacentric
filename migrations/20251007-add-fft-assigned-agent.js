'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = 'food_for_talk_users';
    const tableDesc = await queryInterface.describeTable(table);

    // Add assigned_agent_id if missing
    if (!tableDesc.assigned_agent_id) {
      try {
        await queryInterface.addColumn(table, 'assigned_agent_id', {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'users', key: 'id' },
        });
      } catch (e) {
        if (!String(e?.message || '').includes('already exists')) throw e;
      }
    }

    // Add index for faster lookups
    try {
      await queryInterface.addIndex(table, ['assigned_agent_id'], { name: 'idx_fft_assigned_agent_id' });
    } catch (e) {
      // ignore if exists
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = 'food_for_talk_users';
    const tableDesc = await queryInterface.describeTable(table);
    if (tableDesc.assigned_agent_id) {
      try {
        await queryInterface.removeIndex(table, 'idx_fft_assigned_agent_id');
      } catch (e) {
        // ignore
      }
      await queryInterface.removeColumn(table, 'assigned_agent_id');
    }
  }
};


