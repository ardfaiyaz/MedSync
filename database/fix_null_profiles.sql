-- Fix Null Profile Data Issues
-- Run this in your Supabase SQL Editor to fix existing profiles and ensure future ones work

-- 1. Fix the trigger function to handle null values better
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
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Add RLS policy to allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Update existing profiles that have null first_name/last_name from auth.users metadata
-- This will update profiles where first_name or last_name is null but the data exists in auth.users
UPDATE public.profiles p
SET 
  first_name = COALESCE(p.first_name, au.raw_user_meta_data->>'first_name', ''),
  last_name = COALESCE(p.last_name, au.raw_user_meta_data->>'last_name', '')
FROM auth.users au
WHERE p.id = au.id 
  AND (p.first_name IS NULL OR p.last_name IS NULL)
  AND (au.raw_user_meta_data->>'first_name' IS NOT NULL OR au.raw_user_meta_data->>'last_name' IS NOT NULL);

-- 5. Create profiles for any auth.users that don't have a profile yet
INSERT INTO public.profiles (id, first_name, last_name, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'first_name', ''),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  'staff'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 6. Verify the fix - check profiles
SELECT 
  id,
  first_name,
  last_name,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

