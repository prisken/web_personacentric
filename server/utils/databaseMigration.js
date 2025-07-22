const { sequelize } = require('../config/database');

// Database migration utility
const runMigrations = async () => {
  try {
    console.log('=== Running Database Migrations ===');
    
    // Add new columns if they don't exist
    await sequelize.query(`
      DO $$ 
      BEGIN
        -- Add profile_image to agents table if not exists
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'agents' AND column_name = 'profile_image'
        ) THEN
          ALTER TABLE agents ADD COLUMN profile_image VARCHAR(500);
          COMMENT ON COLUMN agents.profile_image IS 'Cloudinary URL for agent profile image';
        END IF;
        
        -- Add image to events table if not exists
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'events' AND column_name = 'image'
        ) THEN
          ALTER TABLE events ADD COLUMN image VARCHAR(500);
          COMMENT ON COLUMN events.image IS 'Cloudinary URL for event image';
        END IF;
      END $$;
    `);
    
    console.log('Database migrations completed successfully.');
  } catch (error) {
    console.error('Migration error:', error);
    // Don't exit the process, just log the error
  }
};

module.exports = { runMigrations }; 