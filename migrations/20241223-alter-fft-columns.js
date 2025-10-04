'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = 'food_for_talk_users';

    // Add whatsapp_phone if missing
    const tableDesc = await queryInterface.describeTable(table);
    if (!tableDesc.whatsapp_phone) {
      await queryInterface.addColumn(table, 'whatsapp_phone', { type: Sequelize.STRING(20), allowNull: true });
    }

    // Relax NOT NULL constraints that are no longer required
    const relax = async (col, type) => {
      if (tableDesc[col]) {
        await queryInterface.changeColumn(table, col, { type, allowNull: true });
      }
    };

    await relax('first_name', Sequelize.STRING(100));
    await relax('last_name', Sequelize.STRING(100));
    await relax('occupation', Sequelize.STRING(255));
    await relax('bio', Sequelize.TEXT);
    await relax('emergency_contact_name', Sequelize.STRING(255));
    await relax('emergency_contact_phone', Sequelize.STRING(20));
  },

  down: async (queryInterface, Sequelize) => {
    const table = 'food_for_talk_users';
    const tableDesc = await queryInterface.describeTable(table);
    if (tableDesc.whatsapp_phone) {
      await queryInterface.removeColumn(table, 'whatsapp_phone');
    }
    // Revert relax back to NOT NULL (best-effort; may fail if data violates)
    const tighten = async (col, type) => {
      const desc = await queryInterface.describeTable(table);
      if (desc[col]) {
        await queryInterface.changeColumn(table, col, { type, allowNull: false });
      }
    };
    await tighten('first_name', Sequelize.STRING(100));
    await tighten('last_name', Sequelize.STRING(100));
    await tighten('occupation', Sequelize.STRING(255));
    await tighten('bio', Sequelize.TEXT);
    await tighten('emergency_contact_name', Sequelize.STRING(255));
    await tighten('emergency_contact_phone', Sequelize.STRING(20));
  }
};


