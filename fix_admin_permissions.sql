-- 1. Add 'role' column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- 2. Create a specific index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 3. Create a secure function to check if the current user is an admin
-- SECURITY DEFINER means it runs with the privileges of the creator (postgres/admin),
-- bypassing RLS on the profiles table itself to avoid infinite recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update RLS Policies
-- First, ensure RLS is on (it should be, but good to be safe)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view ALL profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT
  USING ( public.is_admin() );

-- Policy: Admins can update ALL profiles (for banning/promoting)
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE
  USING ( public.is_admin() );

-- Note: The existing "Users can view own profile" policy still allows regular users to see themselves.
-- Postgres allows access if ANY policy passes (OR logic).
