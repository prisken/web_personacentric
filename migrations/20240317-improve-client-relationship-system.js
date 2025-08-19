const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add client_id field to users table (without unique constraint first)
    await queryInterface.addColumn('users', 'client_id', {
      type: DataTypes.STRING(10),
      allowNull: true
    });

    // Add unique index for client_id  
    await queryInterface.addIndex('users', ['client_id'], {
      name: 'idx_users_client_id',
      unique: true
    });

    // Update client_relationships table - add new columns
    await queryInterface.addColumn('client_relationships', 'requested_at', {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    });

    await queryInterface.addColumn('client_relationships', 'confirmed_at', {
      type: DataTypes.DATE,
      allowNull: true
    });

    // Update existing relationships to have a confirmed_at date (mark them as active)
    await queryInterface.sequelize.query(`
      UPDATE client_relationships 
      SET confirmed_at = created_at, requested_at = created_at 
      WHERE status = 'active'
    `);

    // Generate client_id for existing client users
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'client' AND client_id IS NULL",
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const user of users) {
      const clientId = Math.random().toString(36).substring(2, 8).toUpperCase();
      await queryInterface.sequelize.query(
        "UPDATE users SET client_id = ? WHERE id = ?",
        { replacements: [clientId, user.id] }
      );
    }

    console.log(`Generated client_ids for ${users.length} existing client users`);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove new columns from client_relationships
    await queryInterface.removeColumn('client_relationships', 'confirmed_at');
    await queryInterface.removeColumn('client_relationships', 'requested_at');
    
    // Remove client_id index and column from users
    await queryInterface.removeIndex('users', 'idx_users_client_id');
    await queryInterface.removeColumn('users', 'client_id');
  }
};