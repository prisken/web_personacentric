#!/usr/bin/env node

/**
 * Database Cleanup Script
 * Removes unused/legacy tables from the database
 * 
 * Tables to remove:
 * 1. quiz_questions (legacy)
 * 2. quiz_responses (legacy) 
 * 3. quiz_sessions (legacy)
 * 4. agent_reviews (unused)
 * 5. recommendations (unused)
 * 
 * Tables to keep:
 * - SequelizeMeta (migration tracking - ESSENTIAL)
 * - All other 27 tables (actively used)
 */

const { Sequelize } = require('sequelize');
const path = require('path');

// Use the same database configuration as the main app
const sequelize = require('../config/database');

// Tables to remove
const TABLES_TO_REMOVE = [
  'quiz_questions',
  'quiz_responses', 
  'quiz_sessions',
  'agent_reviews',
  'recommendations'
];

// Tables to keep (for reference)
const ESSENTIAL_TABLES = [
  'SequelizeMeta', // Migration tracking - DO NOT REMOVE
  'users',
  'agents', 
  'client_relationships',
  'blog_posts',
  'blog_images',
  'blog_categories',
  'blog_post_categories',
  'events',
  'event_registrations',
  'quizzes',
  'quiz_attempts',
  'contests',
  'contest_submissions',
  'subscriptions',
  'payment_transactions',
  'point_transactions',
  'badges',
  'user_badges',
  'gifts',
  'gift_categories',
  'gift_redemptions',
  'access_codes',
  'notifications',
  'client_upgrades'
];

async function checkTableExists(tableName) {
  try {
    const [results] = await sequelize.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='${tableName}';
    `);
    return results.length > 0;
  } catch (error) {
    console.error(`❌ Error checking table ${tableName}:`, error.message);
    return false;
  }
}

async function getTableRowCount(tableName) {
  try {
    const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}";`);
    return parseInt(results[0].count);
  } catch (error) {
    console.error(`❌ Error counting rows in ${tableName}:`, error.message);
    return 0;
  }
}

async function dropTable(tableName) {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS "${tableName}";`);
    console.log(`✅ Successfully dropped table: ${tableName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error dropping table ${tableName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🧹 Database Cleanup Script Starting...\n');
  
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');
    
    // Check which tables exist and have data
    console.log('📊 Checking tables to remove:\n');
    
    const tableStatus = [];
    for (const tableName of TABLES_TO_REMOVE) {
      const exists = await checkTableExists(tableName);
      let rowCount = 0;
      
      if (exists) {
        rowCount = await getTableRowCount(tableName);
      }
      
      tableStatus.push({ name: tableName, exists, rowCount });
      
      console.log(`${exists ? '✅' : '❌'} ${tableName}: ${exists ? `${rowCount} rows` : 'does not exist'}`);
    }
    
    console.log('\n📋 Summary:');
    const existingTables = tableStatus.filter(t => t.exists);
    const tablesWithData = existingTables.filter(t => t.rowCount > 0);
    
    console.log(`- ${existingTables.length} tables exist`);
    console.log(`- ${tablesWithData.length} tables have data`);
    console.log(`- Total rows to be lost: ${existingTables.reduce((sum, t) => sum + t.rowCount, 0)}`);
    
    if (tablesWithData.length > 0) {
      console.log('\n⚠️  WARNING: Some tables contain data!');
      tablesWithData.forEach(t => {
        console.log(`   - ${t.name}: ${t.rowCount} rows`);
      });
    }
    
    console.log('\n🗑️  Proceeding with table removal...\n');
    
    // Drop tables
    let successCount = 0;
    for (const tableName of TABLES_TO_REMOVE) {
      const exists = await checkTableExists(tableName);
      if (exists) {
        const success = await dropTable(tableName);
        if (success) successCount++;
      } else {
        console.log(`⏭️  Skipping ${tableName} (does not exist)`);
      }
    }
    
    console.log(`\n✅ Cleanup completed! ${successCount} tables removed.`);
    
    // Verify cleanup
    console.log('\n🔍 Verifying cleanup...');
    for (const tableName of TABLES_TO_REMOVE) {
      const stillExists = await checkTableExists(tableName);
      console.log(`${stillExists ? '❌' : '✅'} ${tableName}: ${stillExists ? 'still exists' : 'removed'}`);
    }
    
    // Show remaining tables
    console.log('\n📊 Remaining tables in database:');
    const [allTables] = await sequelize.query(`
      SELECT name as table_name 
      FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);
    
    allTables.forEach(table => {
      const isEssential = ESSENTIAL_TABLES.includes(table.table_name);
      console.log(`${isEssential ? '✅' : '❓'} ${table.table_name}`);
    });
    
    console.log(`\n🎉 Database cleanup completed successfully!`);
    console.log(`📈 Reduced from 33 tables to ${allTables.length} tables`);
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
