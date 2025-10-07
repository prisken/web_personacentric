const sequelize = require('../config/database');

/**
 * Mark existing migrations as executed
 * This is needed when the database was created outside the migration system
 */
async function markExistingMigrations() {
  try {
    console.log('🔄 Marking existing migrations as executed...');
    
    // Create migrations table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // List of existing migrations that should be marked as executed
    const existingMigrations = [
      '20230101-create-users-and-agents-tables.js',
      '20240315-add-gift-redemptions.js',
      '20240316-create-client-relationships.js',
      '20240316-create-quiz-tables.js',
      '20240317-improve-client-relationship-system.js',
      '20240318-enhance-quiz-external-support.js',
      '20241219-add-oauth-fields.js',
      '20241219-add-permission-system.js',
      '20241219-add-super-admin-role.js',
      '20241220-create-food-for-talk-tables.js',
      '20241221-add-food-for-talk-event-settings.js',
      '20241222-add-fft-expanded-registration-fields.js',
      '20241223-alter-fft-columns.js',
      '20241224-remove-emergency-contact-fields.js'
    ];
    
    for (const filename of existingMigrations) {
      try {
        await sequelize.query(
          'INSERT INTO migrations (filename) VALUES (?)',
          { replacements: [filename] }
        );
        console.log(`✅ Marked as executed: ${filename}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⚠️  Already marked: ${filename}`);
        } else {
          console.error(`❌ Failed to mark: ${filename}`, error.message);
        }
      }
    }
    
    console.log('🎉 Existing migrations marked successfully!');
    
  } catch (error) {
    console.error('❌ Failed to mark existing migrations:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// CLI interface
async function main() {
  try {
    await markExistingMigrations();
    process.exit(0);
  } catch (error) {
    console.error('💥 Process failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = markExistingMigrations;
