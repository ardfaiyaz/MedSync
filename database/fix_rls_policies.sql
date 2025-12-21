-- Fix RLS Policies to Prevent Infinite Recursion
-- Run this in your Supabase SQL Editor

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update medicines" ON medicines;
DROP POLICY IF EXISTS "Users can delete medicines" ON medicines;

-- Create a SECURITY DEFINER function to check admin status
-- This bypasses RLS to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the profiles policy for admins using the function
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id OR
    public.is_admin(auth.uid())
  );

-- Recreate the medicines update policy using the function
CREATE POLICY "Users can update medicines"
  ON medicines FOR UPDATE
  USING (
    created_by = auth.uid() OR
    public.is_admin(auth.uid())
  );

-- Recreate the medicines delete policy using the function
CREATE POLICY "Users can delete medicines"
  ON medicines FOR DELETE
  USING (
    created_by = auth.uid() OR
    public.is_admin(auth.uid())
  );

