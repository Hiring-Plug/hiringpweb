-- Run this in your Supabase SQL Editor to add the missing 'experience' column

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS experience JSONB;

-- Recommended: Comment about the structure
COMMENT ON COLUMN profiles.experience IS 'Array of { title, company, duration, description }';
