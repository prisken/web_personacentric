const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Database Schema Fixer Utility
 * Handles production database schema fixes and migrations
 */
class DatabaseFixer {
  constructor() {
    this.sequelize = sequelize;
  }

  /**
   * Fix users table schema
   */
  async fixUsersTable() {
    console.log('🔧 Fixing users table...');
    
    const userColumns = [
      { name: 'client_id', type: 'VARCHAR(10)' },
      { name: 'subscription_end_date', type: 'TIMESTAMP' },
      { name: 'grace_period_end_date', type: 'TIMESTAMP' },
      { name: 'verification_token', type: 'VARCHAR(255)' },
      { name: 'reset_password_token', type: 'VARCHAR(255)' },
      { name: 'reset_password_expires', type: 'TIMESTAMP' }
    ];

    for (const column of userColumns) {
      try {
        await this.sequelize.query(`
          ALTER TABLE users 
          ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
        `);
        console.log(`✅ Added column: ${column.name}`);
      } catch (error) {
        console.log(`⚠️ Column ${column.name} already exists or error: ${error.message}`);
      }
    }
  }

  /**
   * Fix client_relationships table schema
   */
  async fixClientRelationshipsTable() {
    console.log('🔧 Fixing client_relationships table...');
    
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
      try {
        await this.sequelize.query(`
          ALTER TABLE client_relationships 
          ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
        `);
        console.log(`✅ Added column: ${column.name}`);
      } catch (error) {
        console.log(`⚠️ Column ${column.name} already exists or error: ${error.message}`);
      }
    }
  }

  /**
   * Fix agents table schema
   */
  async fixAgentsTable() {
    console.log('🔧 Fixing agents table...');
    
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
      try {
        await this.sequelize.query(`
          ALTER TABLE agents 
          ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
        `);
        console.log(`✅ Added column: ${column.name}`);
      } catch (error) {
        console.log(`⚠️ Column ${column.name} already exists or error: ${error.message}`);
      }
    }
  }

  /**
   * Fix events table schema
   */
  async fixEventsTable() {
    console.log('🔧 Fixing events table...');
    
    const eventColumns = [
      { name: 'video_url', type: 'VARCHAR(500)' },
      { name: 'image', type: 'VARCHAR(500)' }
    ];

    for (const column of eventColumns) {
      try {
        await this.sequelize.query(`
          ALTER TABLE events 
          ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
        `);
        console.log(`✅ Added column: ${column.name}`);
      } catch (error) {
        console.log(`⚠️ Column ${column.name} already exists or error: ${error.message}`);
      }
    }
  }

  /**
   * Fix blog_posts table schema
   */
  async fixBlogPostsTable() {
    console.log('🔧 Fixing blog_posts table...');
    
    try {
      await this.sequelize.query(`
        ALTER TABLE blog_posts 
        ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false
      `);
      console.log('✅ Added featured column to blog_posts');
    } catch (error) {
      console.log(`⚠️ Featured column already exists or error: ${error.message}`);
    }
  }

  /**
   * Create ENUM types if they don't exist
   */
  async createEnumTypes() {
    console.log('🔧 Creating ENUM types...');
    
    const enumTypes = [
      { name: 'enum_users_role', values: ['admin', 'agent', 'client'] },
      { name: 'enum_users_language_preference', values: ['en', 'zh-TW'] },
      { name: 'enum_users_subscription_status', values: ['active', 'inactive', 'grace_period'] }
    ];

    for (const enumType of enumTypes) {
      try {
        const values = enumType.values.map(v => `'${v}'`).join(', ');
        await this.sequelize.query(`
          CREATE TYPE IF NOT EXISTS ${enumType.name} AS ENUM (${values})
        `);
        console.log(`✅ Created ENUM type: ${enumType.name}`);
      } catch (error) {
        console.log(`⚠️ ENUM type ${enumType.name} already exists or error: ${error.message}`);
      }
    }
  }

  /**
   * Update column types to use ENUMs
   */
  async updateColumnTypes() {
    console.log('🔄 Updating column types to use ENUMs...');
    
    const columnUpdates = [
      { table: 'users', column: 'role', enumType: 'enum_users_role' },
      { table: 'users', column: 'language_preference', enumType: 'enum_users_language_preference' },
      { table: 'users', column: 'subscription_status', enumType: 'enum_users_subscription_status' }
    ];

    for (const update of columnUpdates) {
      try {
        await this.sequelize.query(`
          ALTER TABLE ${update.table} 
          ALTER COLUMN ${update.column} TYPE ${update.enumType} USING ${update.column}::${update.enumType}
        `);
        console.log(`✅ Updated ${update.table}.${update.column} to ENUM`);
      } catch (error) {
        console.log(`⚠️ Column ${update.table}.${update.column} already has correct type or error: ${error.message}`);
      }
    }
  }

  /**
   * Run all database fixes
   */
  async fixAll() {
    try {
      console.log('🔧 Starting production database schema fix...');
      
      // Test database connection
      await this.sequelize.authenticate();
      console.log('✅ Database connected successfully');
      
      // Fix all tables
      await this.fixUsersTable();
      await this.fixClientRelationshipsTable();
      await this.fixAgentsTable();
      await this.fixEventsTable();
      await this.fixBlogPostsTable();
      
      // Create ENUM types and update columns
      await this.createEnumTypes();
      await this.updateColumnTypes();
      
      console.log('🎉 Production database schema fix completed successfully!');
      
    } catch (error) {
      console.error('❌ Error fixing production database:', error);
      throw error;
    }
  }
}

module.exports = DatabaseFixer; 