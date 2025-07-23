// Fix import: get sequelize instance directly
const sequelize = require('../config/database');

// Database migration utility
const runMigrations = async () => {
  try {
    console.log('=== Running Database Migrations ===');
    
    // Check if profile_image column exists in agents table
    try {
      await sequelize.query(`SELECT profile_image FROM agents LIMIT 1`);
    } catch (error) {
      if (error.message.includes('no such column')) {
        await sequelize.query(`ALTER TABLE agents ADD COLUMN profile_image VARCHAR(500)`);
        console.log('Added profile_image column to agents table');
      }
    }
    
    // Check if image column exists in events table
    try {
      await sequelize.query(`SELECT image FROM events LIMIT 1`);
    } catch (error) {
      if (error.message.includes('no such column')) {
        await sequelize.query(`ALTER TABLE events ADD COLUMN image VARCHAR(500)`);
        console.log('Added image column to events table');
      }
    }
    
    // Check if featured column exists in blog_posts table
    try {
      await sequelize.query(`SELECT featured FROM blog_posts LIMIT 1`);
    } catch (error) {
      if (error.message.includes('no such column')) {
        await sequelize.query(`ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT FALSE`);
        console.log('Added featured column to blog_posts table');
      }
    }
    
    console.log('Database migrations completed successfully.');
  } catch (error) {
    console.error('Migration error:', error);
    // Don't exit the process, just log the error
  }
};

module.exports = { runMigrations }; 