-- =====================================================
-- Row Level Security (RLS) Policies for Better Auth
-- =====================================================
-- This migration adds RLS policies for multi-tenant organization setup
-- with better-auth authentication

-- =====================================================
-- Enable RLS on all tables
-- =====================================================

ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Helper Functions
-- =====================================================

-- Function to check if user is a member of an organization
CREATE OR REPLACE FUNCTION public.is_organization_member(org_id TEXT, user_id TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.member
    WHERE organization_id = org_id 
    AND user_id = is_organization_member.user_id
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to get user's role in an organization
CREATE OR REPLACE FUNCTION public.get_user_role_in_org(org_id TEXT, user_id TEXT)
RETURNS TEXT AS $$
  SELECT role::TEXT
  FROM public.member
  WHERE organization_id = org_id 
  AND user_id = get_user_role_in_org.user_id
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if user is admin or owner
CREATE OR REPLACE FUNCTION public.is_organization_admin(org_id TEXT, user_id TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.member
    WHERE organization_id = org_id 
    AND user_id = is_organization_admin.user_id
    AND role IN ('admin', 'owner')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if user is organization owner
CREATE OR REPLACE FUNCTION public.is_organization_owner(org_id TEXT, user_id TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.member
    WHERE organization_id = org_id 
    AND user_id = is_organization_owner.user_id
    AND role = 'owner'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to get current authenticated user ID from session
-- This assumes you're using Supabase Auth or compatible JWT
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('app.current_user_id', true)
  );
$$ LANGUAGE SQL STABLE;

-- =====================================================
-- USER Table Policies
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.user
  FOR SELECT
  TO authenticated
  USING (id = current_user_id());

-- Users can view profiles of other organization members
CREATE POLICY "Users can view organization members' profiles"
  ON public.user
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT DISTINCT m2.user_id
      FROM public.member m1
      JOIN public.member m2 ON m1.organization_id = m2.organization_id
      WHERE m1.user_id = current_user_id()
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.user
  FOR UPDATE
  TO authenticated
  USING (id = current_user_id())
  WITH CHECK (id = current_user_id());

-- =====================================================
-- SESSION Table Policies
-- =====================================================

-- Users can view their own sessions
CREATE POLICY "Users can view their own sessions"
  ON public.session
  FOR SELECT
  TO authenticated
  USING (user_id = current_user_id());

-- Users can delete their own sessions (logout)
CREATE POLICY "Users can delete their own sessions"
  ON public.session
  FOR DELETE
  TO authenticated
  USING (user_id = current_user_id());

-- =====================================================
-- ACCOUNT Table Policies
-- =====================================================

-- Users can view their own accounts
CREATE POLICY "Users can view their own accounts"
  ON public.account
  FOR SELECT
  TO authenticated
  USING (user_id = current_user_id());

-- =====================================================
-- VERIFICATION Table Policies
-- =====================================================

-- No direct user access to verification table
-- Only backend should access this through service role

-- =====================================================
-- ORGANIZATION Table Policies
-- =====================================================

-- Users can view organizations they are members of
CREATE POLICY "Users can view their organizations"
  ON public.organization
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id
      FROM public.member
      WHERE user_id = current_user_id()
    )
  );

-- Users can update organizations where they are admin or owner
CREATE POLICY "Admins can update organization"
  ON public.organization
  FOR UPDATE
  TO authenticated
  USING (is_organization_admin(id, current_user_id()))
  WITH CHECK (is_organization_admin(id, current_user_id()));

-- Only owners can delete organizations
CREATE POLICY "Owners can delete organization"
  ON public.organization
  FOR DELETE
  TO authenticated
  USING (is_organization_owner(id, current_user_id()));

-- =====================================================
-- MEMBER Table Policies
-- =====================================================

-- Users can view members of organizations they belong to
CREATE POLICY "Users can view organization members"
  ON public.member
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.member
      WHERE user_id = current_user_id()
    )
  );

-- Admins and owners can add members to their organization
CREATE POLICY "Admins can add members"
  ON public.member
  FOR INSERT
  TO authenticated
  WITH CHECK (is_organization_admin(organization_id, current_user_id()));

-- Admins and owners can update member roles (except they can't change their own role)
CREATE POLICY "Admins can update member roles"
  ON public.member
  FOR UPDATE
  TO authenticated
  USING (
    is_organization_admin(organization_id, current_user_id())
    AND user_id != current_user_id()
  )
  WITH CHECK (
    is_organization_admin(organization_id, current_user_id())
    AND user_id != current_user_id()
  );

-- Users can leave an organization (delete their own membership)
CREATE POLICY "Users can leave organization"
  ON public.member
  FOR DELETE
  TO authenticated
  USING (user_id = current_user_id());

-- Admins can remove members (except owners and themselves)
CREATE POLICY "Admins can remove members"
  ON public.member
  FOR DELETE
  TO authenticated
  USING (
    is_organization_admin(organization_id, current_user_id())
    AND user_id != current_user_id()
    AND role != 'owner'
  );

-- =====================================================
-- INVITATION Table Policies
-- =====================================================

-- Users can view invitations for organizations they are members of
CREATE POLICY "Members can view organization invitations"
  ON public.invitation
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.member
      WHERE user_id = current_user_id()
    )
  );

-- Users can view invitations sent to their email
CREATE POLICY "Users can view their own invitations"
  ON public.invitation
  FOR SELECT
  TO authenticated
  USING (
    email IN (
      SELECT email
      FROM public.user
      WHERE id = current_user_id()
    )
  );

-- Admins and owners can create invitations
CREATE POLICY "Admins can create invitations"
  ON public.invitation
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_organization_admin(organization_id, current_user_id())
    AND inviter_id = current_user_id()
  );

-- Admins and owners can update invitations (e.g., cancel)
CREATE POLICY "Admins can update invitations"
  ON public.invitation
  FOR UPDATE
  TO authenticated
  USING (is_organization_admin(organization_id, current_user_id()))
  WITH CHECK (is_organization_admin(organization_id, current_user_id()));

-- Admins and owners can delete invitations
CREATE POLICY "Admins can delete invitations"
  ON public.invitation
  FOR DELETE
  TO authenticated
  USING (is_organization_admin(organization_id, current_user_id()));

-- =====================================================
-- Grant permissions to authenticated role
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON FUNCTION public.is_organization_member IS 'Check if a user is a member of an organization';
COMMENT ON FUNCTION public.get_user_role_in_org IS 'Get the role of a user in an organization';
COMMENT ON FUNCTION public.is_organization_admin IS 'Check if a user is an admin or owner of an organization';
COMMENT ON FUNCTION public.is_organization_owner IS 'Check if a user is the owner of an organization';
COMMENT ON FUNCTION public.current_user_id IS 'Get the current authenticated user ID from JWT or session';

