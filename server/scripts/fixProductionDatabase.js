const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixProductionDatabase() {
  try {
    console.log('🔄 Fixing production database...');
    
    // Create database connection
    const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.DB_URL, {
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    });
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Find super admin
    const [superAdmin] = await sequelize.query(
      "SELECT * FROM users WHERE role = 'super_admin' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (!superAdmin) {
      console.log('❌ Super admin not found');
      return;
    }
    
    // Update password
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    await sequelize.query(
      "UPDATE users SET password_hash = :password WHERE role = 'super_admin'",
      {
        replacements: { password: hashedPassword },
        type: Sequelize.QueryTypes.UPDATE
      }
    );
    
    console.log('✅ Super admin password fixed successfully:', {
      id: superAdmin.id,
      email: superAdmin.email,
      role: superAdmin.role
    });
    
  } catch (error) {
    console.error('❌ Failed to fix production database:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  fixProductionDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = fixProductionDatabase;
