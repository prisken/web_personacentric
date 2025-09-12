const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env.production' });

async function checkProductionDatabase() {
  console.log('🔍 Checking Production Database...');
  
  // Use production database URL
  const dbUrl = process.env.DATABASE_URL || process.env.DB_URL;
  console.log('Database URL:', dbUrl ? 'Found' : 'Not found');
  
  if (!dbUrl) {
    console.error('❌ No DATABASE_URL found in environment variables');
    return;
  }
  
  const sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false // Disable logging for cleaner output
  });
  
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to production database successfully');
    
    // Check users table
    const [users] = await sequelize.query('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Total users in production: ${users[0].count}`);
    
    // Get users by role
    const [roleCounts] = await sequelize.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role 
      ORDER BY role
    `);
    
    console.log('\n📋 Users by role:');
    roleCounts.forEach(row => {
      console.log(`  ${row.role}: ${row.count} users`);
    });
    
    // Get all users with details
    const [allUsers] = await sequelize.query(`
      SELECT id, email, first_name, last_name, role, created_at
      FROM users 
      ORDER BY role, first_name
    `);
    
    console.log('\n👥 All users in production:');
    allUsers.forEach(user => {
      console.log(`  - ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`);
    });
    
    // Check for soft-deleted users
    const [deletedUsers] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE email LIKE 'deleted_%'
    `);
    
    console.log(`\n🗑️  Soft-deleted users: ${deletedUsers[0].count}`);
    
  } catch (error) {
    console.error('❌ Error checking production database:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkProductionDatabase();
