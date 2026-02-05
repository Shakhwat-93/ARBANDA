-- Add is_banned column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;

-- Policy to allow admins to update profiles (specifically for banning)
-- Note: You might need to adjust this depending on your specific admin RLS setup.
-- For now, this assumes admins have access via service role or a specific policy.
-- If you are using Supabase Dashboard to run this, RLS is bypassed.

-- Optional: Create an index for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles(is_banned);
