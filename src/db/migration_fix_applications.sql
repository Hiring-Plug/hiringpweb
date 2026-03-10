-- Migration: Fix Application Submission RLS and Schema
-- This script adds missing columns and policies to the applications table.

-- 1. Add missing columns to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES auth.users;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS job_title text;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can see their own applications." ON applications;
DROP POLICY IF EXISTS "Users can update their own applications." ON applications;
DROP POLICY IF EXISTS "Users can delete their own applications." ON applications;
DROP POLICY IF EXISTS "Users can see their own applications or those for their projects" ON applications;
DROP POLICY IF EXISTS "Authenticated users can insert applications" ON applications;
DROP POLICY IF EXISTS "Applicants and owners can update status" ON applications;
DROP POLICY IF EXISTS "Applicants can delete their own applications" ON applications;

-- 3. Create new comprehensive policies
CREATE POLICY "Users can see their own applications or those for their projects"
  ON applications FOR SELECT
  USING ( auth.uid() = applicant_id OR auth.uid() = project_id );

CREATE POLICY "Authenticated users can insert applications"
  ON applications FOR INSERT
  WITH CHECK ( auth.uid() = applicant_id );

CREATE POLICY "Applicants and owners can update status"
  ON applications FOR UPDATE
  USING ( auth.uid() = applicant_id OR auth.uid() = project_id );

CREATE POLICY "Applicants can delete their own applications"
  ON applications FOR DELETE
  USING ( auth.uid() = applicant_id );

-- 4. Fix Storage RLS for Resumes
-- Ensure 'resumes' bucket exists and has correct policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Resumes are publicly accessible." ON storage.objects;
CREATE POLICY "Resumes are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'resumes' );

DROP POLICY IF EXISTS "Anyone can upload a resume." ON storage.objects;
CREATE POLICY "Anyone can upload a resume."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'resumes' );
