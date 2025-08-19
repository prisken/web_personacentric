const { DataTypes } = require('sequelize');
const sequelize = require('./config/database');

// Function to generate unique client ID
const generateClientId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

async function runProductionMigration() {
  try {
    console.log('🚀 Starting production database migration...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    // Check if client_id column already exists
    const [results] = await sequelize.query("PRAGMA table_info(users)");
    const hasClientId = results.some(col => col.name === 'client_id');
    
    if (!hasClientId) {
      console.log('📋 Adding client_id column to users table...');
      await sequelize.query("ALTER TABLE users ADD COLUMN client_id VARCHAR(10)");
      console.log('✅ client_id column added');
    } else {
      console.log('✅ client_id column already exists');
    }
    
    // Add index for client_id
    try {
      await sequelize.query("CREATE INDEX idx_users_client_id ON users(client_id)");
      console.log('✅ client_id index created');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ client_id index already exists');
      } else {
        throw error;
      }
    }
    
    // Check if requested_at column exists in client_relationships
    const [relResults] = await sequelize.query("PRAGMA table_info(client_relationships)");
    const hasRequestedAt = relResults.some(col => col.name === 'requested_at');
    
    if (!hasRequestedAt) {
      console.log('📋 Adding requested_at column to client_relationships table...');
      await sequelize.query("ALTER TABLE client_relationships ADD COLUMN requested_at DATETIME DEFAULT CURRENT_TIMESTAMP");
      console.log('✅ requested_at column added');
    } else {
      console.log('✅ requested_at column already exists');
    }
    
    // Check if confirmed_at column exists
    const hasConfirmedAt = relResults.some(col => col.name === 'confirmed_at');
    
    if (!hasConfirmedAt) {
      console.log('📋 Adding confirmed_at column to client_relationships table...');
      await sequelize.query("ALTER TABLE client_relationships ADD COLUMN confirmed_at DATETIME");
      console.log('✅ confirmed_at column added');
    } else {
      console.log('✅ confirmed_at column already exists');
    }
    
    // Update existing active relationships
    console.log('📋 Updating existing active relationships...');
    await sequelize.query(`
      UPDATE client_relationships 
      SET confirmed_at = created_at, requested_at = created_at 
      WHERE status = 'active'
    `);
    console.log('✅ Existing relationships updated');
    
    // Generate client_id for existing client users who don't have one
    console.log('📋 Generating client_id for existing client users...');
    const [clientsWithoutId] = await sequelize.query(`
      SELECT id FROM users 
      WHERE role = 'client' AND client_id IS NULL
    `);
    
    for (const client of clientsWithoutId) {
      let clientId;
      let isUnique = false;
      
      // Generate unique client_id
      while (!isUnique) {
        clientId = generateClientId();
        const [existing] = await sequelize.query(`
          SELECT id FROM users WHERE client_id = ?
        `, { replacements: [clientId] });
        
        if (existing.length === 0) {
          isUnique = true;
        }
      }
      
      await sequelize.query(`
        UPDATE users SET client_id = ? WHERE id = ?
      `, { replacements: [clientId, client.id] });
      
      console.log(`✅ Generated client_id ${clientId} for user ${client.id}`);
    }
    
    console.log('🎉 Production migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

runProductionMigration(); 