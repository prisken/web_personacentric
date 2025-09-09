-- Production Database Schema Fix
-- Add missing columns for super admin system

-- Add permissions column
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';

-- Add created_by_super_admin column
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by_super_admin UUID REFERENCES users(id);

-- Add is_system_admin column
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_system_admin BOOLEAN DEFAULT FALSE;

-- Add super_admin to role enum (PostgreSQL specific)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_role')) THEN
        ALTER TYPE enum_users_role ADD VALUE 'super_admin';
    END IF;
END $$;
