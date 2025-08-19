const { User, ClientRelationship } = require('./models');
const sequelize = require('./config/database');
const { Op } = require('sequelize');

async function checkDatabaseSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Check if users table has client_id column
    const [results] = await sequelize.query("PRAGMA table_info(users)");
    const hasClientId = results.some(col => col.name === 'client_id');
    console.log(`📋 Users table has client_id column: ${hasClientId}`);
    
    if (hasClientId) {
      // Check if client_id column has data
      const usersWithClientId = await User.count({ where: { client_id: { [Op.ne]: null } } });
      console.log(`👥 Users with client_id: ${usersWithClientId}`);
    }
    
    // Check if client_relationships table has new columns
    const [relResults] = await sequelize.query("PRAGMA table_info(client_relationships)");
    const hasRequestedAt = relResults.some(col => col.name === 'requested_at');
    const hasConfirmedAt = relResults.some(col => col.name === 'confirmed_at');
    console.log(`📋 Client_relationships table has requested_at: ${hasRequestedAt}`);
    console.log(`📋 Client_relationships table has confirmed_at: ${hasConfirmedAt}`);
    
    // Test basic user query
    const userCount = await User.count();
    console.log(`👥 Total users in database: ${userCount}`);
    
    // Test finding a specific user
    const adminUser = await User.findOne({ where: { email: 'admin@personacentric.com' } });
    if (adminUser) {
      console.log(`✅ Found admin user: ${adminUser.email}`);
      console.log(`   client_id: ${adminUser.client_id || 'null'}`);
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

checkDatabaseSchema(); 