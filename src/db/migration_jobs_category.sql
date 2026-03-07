-- Run this in your Supabase SQL Editor to fix the 'category' missing column error
-- and add other missing branding fields for jobs.

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS tags text[];

-- Optional: Add a comment to describe the intent
COMMENT ON COLUMN jobs.category IS 'Job category e.g. DeFi, NFT, DAO, Infrastructure';
COMMENT ON COLUMN jobs.logo_url IS 'Specific project or company logo for this job listing';
COMMENT ON COLUMN jobs.tags IS 'Array of skills and keywords for this role';
