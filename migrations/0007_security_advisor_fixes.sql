-- Harden SECURITY DEFINER helpers by pinning search_path
-- This addresses "Function Search Path Mutable" advisories.

ALTER FUNCTION IF EXISTS public.is_organization_member(text, text)
  SET search_path = pg_catalog, public;

ALTER FUNCTION IF EXISTS public.get_user_role_in_org(text, text)
  SET search_path = pg_catalog, public;

ALTER FUNCTION IF EXISTS public.is_organization_admin(text, text)
  SET search_path = pg_catalog, public;

ALTER FUNCTION IF EXISTS public.is_organization_owner(text, text)
  SET search_path = pg_catalog, public;

ALTER FUNCTION IF EXISTS public.current_user_id()
  SET search_path = pg_catalog, public;

-- If present in this database, also set for timestamp trigger helper
ALTER FUNCTION IF EXISTS public.update_updated_at_column()
  SET search_path = pg_catalog, public;


