// Fix Production Database Schema
// Run this in Railway console to add missing columns

const { Sequelize } = require('sequelize');

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

async function fixProductionDatabase() {
  try {
    console.log('🔧 Starting production database fix...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Check if client_id column exists
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'client_id'
    `);
    
    if (results.length === 0) {
      console.log('⚠️ client_id column missing, adding it...');
      
      // Add client_id column
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN client_id VARCHAR(10)
      `);
      
      console.log('✅ client_id column added successfully');
    } else {
      console.log('✅ client_id column already exists');
    }
    
    // Check for other missing columns
    const requiredColumns = [
      'subscription_end_date',
      'grace_period_end_date',
      'verification_token',
      'reset_password_token',
      'reset_password_expires'
    ];
    
    for (const column of requiredColumns) {
      const [columnCheck] = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = '${column}'
      `);
      
      if (columnCheck.length === 0) {
        console.log(`⚠️ ${column} column missing, adding it...`);
        
        let columnType = 'VARCHAR(255)';
        if (column.includes('_date') || column.includes('_expires')) {
          columnType = 'TIMESTAMP';
        }
        
        await sequelize.query(`
          ALTER TABLE users 
          ADD COLUMN ${column} ${columnType}
        `);
        
        console.log(`✅ ${column} column added successfully`);
      } else {
        console.log(`✅ ${column} column already exists`);
      }
    }
    
    // Check if ENUM types exist
    const [enumCheck] = await sequelize.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typname IN ('enum_users_role', 'enum_users_language_preference', 'enum_users_subscription_status')
    `);
    
    if (enumCheck.length === 0) {
      console.log('⚠️ ENUM types missing, creating them...');
      
      // Create ENUM types
      await sequelize.query(`
        CREATE TYPE enum_users_role AS ENUM ('admin', 'agent', 'client')
      `);
      
      await sequelize.query(`
        CREATE TYPE enum_users_language_preference AS ENUM ('en', 'zh-TW')
      `);
      
      await sequelize.query(`
        CREATE TYPE enum_users_subscription_status AS ENUM ('active', 'inactive', 'grace_period')
      `);
      
      console.log('✅ ENUM types created successfully');
    } else {
      console.log('✅ ENUM types already exist');
    }
    
    // Update column types to use ENUMs
    console.log('🔄 Updating column types to use ENUMs...');
    
    try {
      await sequelize.query(`
        ALTER TABLE users 
        ALTER COLUMN role TYPE enum_users_role USING role::enum_users_role
      `);
      console.log('✅ role column updated to ENUM');
    } catch (error) {
      console.log('⚠️ role column already has correct type');
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE users 
        ALTER COLUMN language_preference TYPE enum_users_language_preference USING language_preference::enum_users_language_preference
      `);
      console.log('✅ language_preference column updated to ENUM');
    } catch (error) {
      console.log('⚠️ language_preference column already has correct type');
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE users 
        ALTER COLUMN subscription_status TYPE enum_users_subscription_status USING subscription_status::enum_users_subscription_status
      `);
      console.log('✅ subscription_status column updated to ENUM');
    } catch (error) {
      console.log('⚠️ subscription_status column already has correct type');
    }
    
    console.log('🎉 Production database fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing production database:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the function
fixProductionDatabase()
  .then(() => {
    console.log('✅ Database fix completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database fix failed:', error);
    process.exit(1);
  }); 