-- Add profile_image field to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

-- Add image field to events table  
ALTER TABLE events ADD COLUMN IF NOT EXISTS image VARCHAR(500);

-- Add comments to the new columns
COMMENT ON COLUMN agents.profile_image IS 'Cloudinary URL for agent profile image';
COMMENT ON COLUMN events.image IS 'Cloudinary URL for event image'; 