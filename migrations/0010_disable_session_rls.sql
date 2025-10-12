-- Disable RLS on session table since Better Auth manages it directly
-- Better Auth doesn't use Supabase JWT, so current_user_id() returns null
ALTER TABLE public.session DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on verification table (Better Auth managed)
ALTER TABLE public.verification DISABLE ROW LEVEL SECURITY;

-- Drop session policies since they're no longer needed
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.session;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.session;

