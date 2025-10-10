-- Fix the reset password columns to have proper types
ALTER TABLE food_for_talk_users 
  ALTER COLUMN reset_password_token TYPE VARCHAR(255),
  ALTER COLUMN reset_password_expires TYPE TIMESTAMP WITH TIME ZONE USING reset_password_expires::timestamp with time zone;
