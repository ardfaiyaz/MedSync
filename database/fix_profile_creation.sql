-- Fix Profile Creation Issues
-- Run this in your Supabase SQL Editor

-- First, ensure the trigger function exists and works
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'staff'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS allows profile insertion for authenticated users
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also allow service role to insert (for admin operations)
-- This is already handled by SECURITY DEFINER in the function, but let's be explicit

-- Check if profiles table has the correct structure
-- If you need to add missing columns, uncomment and run:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS house_number TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS street_name TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS barangay TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS province TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthday DATE;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS license_url TEXT;

