-- Migration: Fix Job and Gig Deletion and RLS Policies

-- 1. Add DELETE policy for jobs
-- This allows project owners to delete their own job postings.
DROP POLICY IF EXISTS "project can delete their own jobs" ON jobs;
CREATE POLICY "project can delete their own jobs"
  ON jobs FOR DELETE
  USING ( auth.uid() = project_id );

-- 2. Add DELETE policy for gigs
-- This allows gig owners to delete their own gig postings.
DROP POLICY IF EXISTS "Owners can delete their own gigs" ON gigs;
CREATE POLICY "Owners can delete their own gigs"
  ON gigs FOR DELETE
  USING ( auth.uid() = owner_id );

-- 3. Update applications table foreign keys with ON DELETE CASCADE
-- This ensures that when a job or gig is deleted, the associated applications are also removed,
-- preventing foreign key violation errors.

-- For jobs
ALTER TABLE applications 
  DROP CONSTRAINT IF EXISTS applications_job_id_fkey;

ALTER TABLE applications
  ADD CONSTRAINT applications_job_id_fkey 
  FOREIGN KEY (job_id) 
  REFERENCES jobs(id) 
  ON DELETE CASCADE;

-- For gigs (if applicable)
ALTER TABLE applications 
  DROP CONSTRAINT IF EXISTS applications_gig_id_fkey;

ALTER TABLE applications
  ADD CONSTRAINT applications_gig_id_fkey 
  FOREIGN KEY (gig_id) 
  REFERENCES gigs(id) 
  ON DELETE CASCADE;

-- 4. Add MISSING RLS Policies for Applications
-- Allow applicants to update (e.g., withdraw) or delete their applications.

DROP POLICY IF EXISTS "Users can update their own applications" ON applications;
CREATE POLICY "Users can update their own applications"
  ON applications FOR UPDATE
  USING ( auth.uid() = applicant_id );

DROP POLICY IF EXISTS "Users can delete their own applications" ON applications;
CREATE POLICY "Users can delete their own applications"
  ON applications FOR DELETE
  USING ( auth.uid() = applicant_id );

-- 5. Add UPDATE policy for gigs (missing in some versions)
DROP POLICY IF EXISTS "Owners can update their own gigs" ON gigs;
CREATE POLICY "Owners can update their own gigs"
  ON gigs FOR UPDATE
  USING ( auth.uid() = owner_id );
