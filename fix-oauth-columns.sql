-- Add missing OAuth columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS facebook_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'local';

-- Update existing users to have provider = 'local'
UPDATE users SET provider = 'local' WHERE provider IS NULL;
