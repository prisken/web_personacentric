#!/usr/bin/env node

/**
 * Railway Console Database Cleanup Script
 * Run this directly in Railway console to clean up production database
 * 
 * Tables to remove:
 * 1. quiz_questions (legacy)
 * 2. quiz_responses (legacy) 
 * 3. quiz_sessions (legacy)
 * 4. agent_reviews (unused)
 * 5. recommendations (unused)
 */

const { Sequelize } = require('sequelize');

// Use Railway's DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: console.log,
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
});

const TABLES_TO_REMOVE = [
  'quiz_questions',
  'quiz_responses', 
  'quiz_sessions',
  'agent_reviews',
  'recommendations'
];

async function main() {
  console.log('🧹 Railway Database Cleanup Starting...\n');
  
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Railway database\n');
    
    // Check tables before removal
    console.log('📊 Tables to remove:');
    for (const tableName of TABLES_TO_REMOVE) {
      try {
        const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}";`);
        const count = parseInt(results[0].count);
        console.log(`- ${tableName}: ${count} rows`);
      } catch (error) {
        console.log(`- ${tableName}: does not exist`);
      }
    }
    
    console.log('\n🗑️ Removing tables...');
    
    // Drop tables
    for (const tableName of TABLES_TO_REMOVE) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);
        console.log(`✅ Dropped: ${tableName}`);
      } catch (error) {
        console.log(`⏭️ Skipped: ${tableName} (${error.message})`);
      }
    }
    
    // Verify removal
    console.log('\n🔍 Verification:');
    for (const tableName of TABLES_TO_REMOVE) {
      try {
        await sequelize.query(`SELECT 1 FROM "${tableName}" LIMIT 1;`);
        console.log(`❌ ${tableName}: still exists`);
      } catch (error) {
        console.log(`✅ ${tableName}: removed`);
      }
    }
    
    // Count remaining tables
    const [allTables] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    
    console.log(`\n🎉 Cleanup complete! Database now has ${allTables[0].count} tables.`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

main();
