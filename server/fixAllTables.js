// Comprehensive Database Schema Fix
// Run this in Railway console to fix all missing columns

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

async function fixAllTables() {
  try {
    console.log('🔧 Starting comprehensive database schema fix...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Fix users table
    console.log('\n📋 Fixing users table...');
    const userColumns = [
      { name: 'client_id', type: 'VARCHAR(10)' },
      { name: 'subscription_end_date', type: 'TIMESTAMP' },
      { name: 'grace_period_end_date', type: 'TIMESTAMP' },
      { name: 'verification_token', type: 'VARCHAR(255)' },
      { name: 'reset_password_token', type: 'VARCHAR(255)' },
      { name: 'reset_password_expires', type: 'TIMESTAMP' }
    ];
    
    for (const column of userColumns) {
      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
      `);
      console.log(`✅ Added ${column.name} to users table`);
    }
    
    // Fix client_relationships table
    console.log('\n📋 Fixing client_relationships table...');
    const clientRelationshipColumns = [
      { name: 'requested_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
      { name: 'confirmed_at', type: 'TIMESTAMP' },
      { name: 'commission_rate', type: 'DECIMAL(5,4) DEFAULT 0.10' },
      { name: 'total_commission', type: 'DECIMAL(10,2) DEFAULT 0.00' },
      { name: 'notes', type: 'TEXT' },
      { name: 'relationship_start_date', type: 'TIMESTAMP' },
      { name: 'last_contact_date', type: 'TIMESTAMP' },
      { name: 'client_goals', type: 'JSON' },
      { name: 'risk_tolerance', type: 'VARCHAR(20)' },
      { name: 'investment_horizon', type: 'VARCHAR(20)' }
    ];
    
    for (const column of clientRelationshipColumns) {
      await sequelize.query(`
        ALTER TABLE client_relationships 
        ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
      `);
      console.log(`✅ Added ${column.name} to client_relationships table`);
    }
    
    // Fix agents table
    console.log('\n📋 Fixing agents table...');
    const agentColumns = [
      { name: 'rating', type: 'DECIMAL(3,2)' },
      { name: 'total_reviews', type: 'INTEGER DEFAULT 0' },
      { name: 'profile_image', type: 'VARCHAR(500)' },
      { name: 'areas_of_expertise', type: 'JSON' },
      { name: 'languages', type: 'JSON' },
      { name: 'preferred_client_types', type: 'JSON' },
      { name: 'communication_modes', type: 'JSON' },
      { name: 'availability', type: 'TEXT' },
      { name: 'location', type: 'VARCHAR(255)' },
      { name: 'status', type: 'VARCHAR(20) DEFAULT \'pending\'' },
      { name: 'in_matching_pool', type: 'BOOLEAN DEFAULT false' }
    ];
    
    for (const column of agentColumns) {
      await sequelize.query(`
        ALTER TABLE agents 
        ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
      `);
      console.log(`✅ Added ${column.name} to agents table`);
    }
    
    // Fix events table
    console.log('\n📋 Fixing events table...');
    const eventColumns = [
      { name: 'video_url', type: 'VARCHAR(500)' },
      { name: 'image', type: 'VARCHAR(500)' }
    ];
    
    for (const column of eventColumns) {
      await sequelize.query(`
        ALTER TABLE events 
        ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
      `);
      console.log(`✅ Added ${column.name} to events table`);
    }
    
    // Fix blog_posts table
    console.log('\n📋 Fixing blog_posts table...');
    const blogPostColumns = [
      { name: 'featured', type: 'BOOLEAN DEFAULT false' }
    ];
    
    for (const column of blogPostColumns) {
      await sequelize.query(`
        ALTER TABLE blog_posts 
        ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
      `);
      console.log(`✅ Added ${column.name} to blog_posts table`);
    }
    
    // Create missing tables if they don't exist
    console.log('\n📋 Creating missing tables...');
    
    // Create access_codes table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS access_codes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(10) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id),
        created_by UUID REFERENCES users(id),
        is_used BOOLEAN DEFAULT false,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created access_codes table');
    
    // Create notifications table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created notifications table');
    
    // Create badges table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS badges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        requirement_type VARCHAR(50),
        requirement_value INTEGER,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created badges table');
    
    // Create user_badges table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        badge_id UUID REFERENCES badges(id),
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, badge_id)
      )
    `);
    console.log('✅ Created user_badges table');
    
    // Create gift_categories table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS gift_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created gift_categories table');
    
    // Create gifts table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS gifts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category_id UUID REFERENCES gift_categories(id),
        points_required INTEGER NOT NULL DEFAULT 0,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(20) DEFAULT 'draft',
        availability_start TIMESTAMP,
        availability_end TIMESTAMP,
        display_order INTEGER DEFAULT 0,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created gifts table');
    
    // Create gift_redemptions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS gift_redemptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        gift_id UUID REFERENCES gifts(id),
        user_id UUID REFERENCES users(id),
        redemption_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created gift_redemptions table');
    
    console.log('\n🎉 Comprehensive database schema fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the function
fixAllTables()
  .then(() => {
    console.log('✅ All database tables fixed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database fix failed:', error);
    process.exit(1);
  }); 