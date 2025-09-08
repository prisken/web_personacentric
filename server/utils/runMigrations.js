const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

/**
 * Migration Runner Utility
 * Handles running database migrations in order
 */
class MigrationRunner {
  constructor() {
    this.migrationsDir = path.join(__dirname, '../../migrations');
    this.sequelize = require('../config/database');
  }

  /**
   * Get all migration files in order
   */
  getMigrationFiles() {
    const files = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();
    
    return files.map(file => ({
      name: file,
      path: path.join(this.migrationsDir, file)
    }));
  }

  /**
   * Create migrations tracking table
   */
  async createMigrationsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await this.sequelize.query(query);
    console.log('✅ Migrations table created/verified');
  }

  /**
   * Get executed migrations
   */
  async getExecutedMigrations() {
    try {
      const [results] = await this.sequelize.query(
        'SELECT filename FROM migrations ORDER BY executed_at'
      );
      return results.map(row => row.filename);
    } catch (error) {
      // Table doesn't exist yet, return empty array
      return [];
    }
  }

  /**
   * Mark migration as executed
   */
  async markMigrationExecuted(filename) {
    await this.sequelize.query(
      'INSERT INTO migrations (filename) VALUES (?)',
      { replacements: [filename] }
    );
  }

  /**
   * Remove migration from executed list
   */
  async unmarkMigrationExecuted(filename) {
    await this.sequelize.query(
      'DELETE FROM migrations WHERE filename = ?',
      { replacements: [filename] }
    );
  }

  /**
   * Run a single migration
   */
  async runMigration(migrationFile) {
    console.log(`🔄 Running migration: ${migrationFile.name}`);
    
    try {
      // Clear require cache to ensure fresh load
      delete require.cache[migrationFile.path];
      const migration = require(migrationFile.path);
      
      if (migration.up) {
        await migration.up(this.sequelize.getQueryInterface(), Sequelize);
        console.log(`✅ Migration completed: ${migrationFile.name}`);
        return true;
      } else {
        console.log(`⚠️  Migration has no 'up' function: ${migrationFile.name}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Migration failed: ${migrationFile.name}`);
      console.error(error.message);
      throw error;
    }
  }

  /**
   * Rollback a single migration
   */
  async rollbackMigration(migrationFile) {
    console.log(`🔄 Rolling back migration: ${migrationFile.name}`);
    
    try {
      // Clear require cache to ensure fresh load
      delete require.cache[migrationFile.path];
      const migration = require(migrationFile.path);
      
      if (migration.down) {
        await migration.down(this.sequelize.getQueryInterface(), Sequelize);
        console.log(`✅ Migration rolled back: ${migrationFile.name}`);
        return true;
      } else {
        console.log(`⚠️  Migration has no 'down' function: ${migrationFile.name}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Migration rollback failed: ${migrationFile.name}`);
      console.error(error.message);
      throw error;
    }
  }

  /**
   * Run all pending migrations
   */
  async runMigrations() {
    console.log('🚀 Starting migration process...');
    
    try {
      await this.createMigrationsTable();
      
      const migrationFiles = this.getMigrationFiles();
      const executedMigrations = await this.getExecutedMigrations();
      
      const pendingMigrations = migrationFiles.filter(
        file => !executedMigrations.includes(file.name)
      );
      
      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations');
        return;
      }
      
      console.log(`📋 Found ${pendingMigrations.length} pending migrations`);
      
      for (const migrationFile of pendingMigrations) {
        await this.runMigration(migrationFile);
        await this.markMigrationExecuted(migrationFile.name);
      }
      
      console.log('🎉 All migrations completed successfully!');
      
    } catch (error) {
      console.error('💥 Migration process failed:', error.message);
      throw error;
    }
  }

  /**
   * Rollback last migration
   */
  async rollbackLastMigration() {
    console.log('🔄 Rolling back last migration...');
    
    try {
      await this.createMigrationsTable();
      
      const migrationFiles = this.getMigrationFiles();
      const executedMigrations = await this.getExecutedMigrations();
      
      if (executedMigrations.length === 0) {
        console.log('✅ No migrations to rollback');
        return;
      }
      
      const lastMigrationName = executedMigrations[executedMigrations.length - 1];
      const lastMigrationFile = migrationFiles.find(
        file => file.name === lastMigrationName
      );
      
      if (!lastMigrationFile) {
        console.log(`⚠️  Migration file not found: ${lastMigrationName}`);
        return;
      }
      
      await this.rollbackMigration(lastMigrationFile);
      await this.unmarkMigrationExecuted(lastMigrationName);
      
      console.log('🎉 Migration rolled back successfully!');
      
    } catch (error) {
      console.error('💥 Migration rollback failed:', error.message);
      throw error;
    }
  }

  /**
   * Show migration status
   */
  async showStatus() {
    console.log('📊 Migration Status:');
    
    try {
      await this.createMigrationsTable();
      
      const migrationFiles = this.getMigrationFiles();
      const executedMigrations = await this.getExecutedMigrations();
      
      console.log(`\n📋 Total migration files: ${migrationFiles.length}`);
      console.log(`✅ Executed migrations: ${executedMigrations.length}`);
      console.log(`⏳ Pending migrations: ${migrationFiles.length - executedMigrations.length}`);
      
      console.log('\n📝 Migration Details:');
      for (const file of migrationFiles) {
        const status = executedMigrations.includes(file.name) ? '✅' : '⏳';
        console.log(`  ${status} ${file.name}`);
      }
      
    } catch (error) {
      console.error('💥 Failed to show status:', error.message);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close() {
    await this.sequelize.close();
  }
}

// CLI interface
async function main() {
  const command = process.argv[2] || 'up';
  const runner = new MigrationRunner();
  
  try {
    switch (command) {
      case 'up':
        await runner.runMigrations();
        break;
      case 'down':
        await runner.rollbackLastMigration();
        break;
      case 'status':
        await runner.showStatus();
        break;
      default:
        console.log('Usage: node runMigrations.js [up|down|status]');
        process.exit(1);
    }
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  } finally {
    await runner.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = MigrationRunner;
