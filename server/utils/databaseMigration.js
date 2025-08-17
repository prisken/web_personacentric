// Fix import: get sequelize instance directly
const sequelize = require('../config/database');

// Database migration utility
async function runMigrations() {
  console.log('=== Running Database Migrations ===');
  
  try {
    // Migration 1: Add profile_image to agents table
    await sequelize.query(`
      SELECT profile_image FROM agents LIMIT 1
    `).catch(async () => {
      console.log('Adding profile_image column to agents table...');
      await sequelize.query(`
        ALTER TABLE agents ADD COLUMN profile_image VARCHAR(500);
      `);
    });

    // Migration 2: Add image to events table
    await sequelize.query(`
      SELECT image FROM events LIMIT 1
    `).catch(async () => {
      console.log('Adding image column to events table...');
      await sequelize.query(`
        ALTER TABLE events ADD COLUMN image VARCHAR(500);
      `);
    });

    // Migration 3: Add featured to blog_posts table
    await sequelize.query(`
      SELECT featured FROM blog_posts LIMIT 1
    `).catch(async () => {
      console.log('Adding featured column to blog_posts table...');
      await sequelize.query(`
        ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT FALSE;
      `);
    });

    // Migration 4: Add video_url to events table
    await sequelize.query(`
      SELECT video_url FROM events LIMIT 1
    `).catch(async () => {
      console.log('Adding video_url column to events table...');
      await sequelize.query(`
        ALTER TABLE events ADD COLUMN video_url VARCHAR(500);
      `);
    });

    console.log('Database migrations completed successfully.');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

module.exports = { runMigrations }; 