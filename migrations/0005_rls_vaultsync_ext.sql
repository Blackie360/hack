-- Enable RLS on LockIn tables
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_key_wrap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_recovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_device_key ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rotation_job ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rotation_approval ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rotation_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rotation_key_wrap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_member ENABLE ROW LEVEL SECURITY;

-- PROJECT policies
CREATE POLICY "org members can select project" ON public.project
  FOR SELECT TO authenticated
  USING (
    org_id IN (SELECT organization_id FROM public.member WHERE user_id = public.current_user_id())
  );

CREATE POLICY "admins can mutate project" ON public.project
  FOR ALL TO authenticated
  USING (public.is_organization_admin(org_id, public.current_user_id()))
  WITH CHECK (public.is_organization_admin(org_id, public.current_user_id()));

-- PROJECT_MEMBER policies
CREATE POLICY "org members select project_member" ON public.project_member
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT id FROM public.project p
      WHERE p.org_id IN (SELECT organization_id FROM public.member WHERE user_id = public.current_user_id())
    )
  );

CREATE POLICY "admins upsert project_member" ON public.project_member
  FOR ALL TO authenticated
  USING (
    (SELECT public.is_organization_admin(p.org_id, public.current_user_id()) FROM public.project p WHERE p.id = project_id)
  )
  WITH CHECK (
    (SELECT public.is_organization_admin(p.org_id, public.current_user_id()) FROM public.project p WHERE p.id = project_id)
  );

-- ENVIRONMENT policies
CREATE POLICY "org members can select environment" ON public.environment
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM public.project p
      WHERE p.org_id IN (SELECT organization_id FROM public.member WHERE user_id = public.current_user_id())
    )
  );

CREATE POLICY "admins can mutate environment" ON public.environment
  FOR ALL TO authenticated
  USING (
    (SELECT public.is_organization_admin(p.org_id, public.current_user_id()) FROM public.project p WHERE p.id = project_id)
  )
  WITH CHECK (
    (SELECT public.is_organization_admin(p.org_id, public.current_user_id()) FROM public.project p WHERE p.id = project_id)
  );

-- SECRET policies
CREATE POLICY "org members can select secret" ON public.secret
  FOR SELECT TO authenticated
  USING (
    (
      -- owners can see all
      (SELECT public.get_user_role_in_org(p.org_id, public.current_user_id()) = 'owner' FROM public.project p WHERE p.id = project_id)
    )
    OR (
      -- otherwise, must be in project_member
      project_id IN (
        SELECT pm.project_id FROM public.project_member pm
        JOIN public.member m ON m.id = pm.member_id
        WHERE m.user_id = public.current_user_id()
      )
    )
  );

CREATE POLICY "admins can insert secret" ON public.secret
  FOR INSERT TO authenticated
  WITH CHECK (
    (
      (SELECT public.is_organization_admin(p.org_id, public.current_user_id()) FROM public.project p WHERE p.id = project_id)
      OR (
        project_id IN (
          SELECT pm.project_id FROM public.project_member pm
          JOIN public.member m ON m.id = pm.member_id
          WHERE m.user_id = public.current_user_id()
        )
      )
    )
  );

CREATE POLICY "admins can update/delete secret" ON public.secret
  FOR UPDATE TO authenticated
  USING (
    (SELECT public.is_organization_admin(p.org_id, public.current_user_id()) FROM public.project p WHERE p.id = project_id)
  )
  WITH CHECK (
    (SELECT public.is_organization_admin(p.org_id, public.current_user_id()) FROM public.project p WHERE p.id = project_id)
  );

CREATE POLICY "admins can delete secret" ON public.secret
  FOR DELETE TO authenticated
  USING (
    (SELECT public.is_organization_admin(p.org_id, public.current_user_id()) FROM public.project p WHERE p.id = project_id)
  );

-- SECRET_VERSION policies
CREATE POLICY "org members can select secret_version" ON public.secret_version
  FOR SELECT TO authenticated
  USING (
    secret_id IN (
      SELECT s.id FROM public.secret s
      WHERE s.project_id IN (
        SELECT p.id FROM public.project p
        WHERE p.org_id IN (SELECT organization_id FROM public.member WHERE user_id = public.current_user_id())
      )
    )
  );

CREATE POLICY "admins can insert secret_version" ON public.secret_version
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT public.is_organization_admin(p.org_id, public.current_user_id()) FROM public.project p JOIN public.secret s ON s.project_id = p.id WHERE s.id = secret_id)
  );

-- ORG_KEY_WRAP policies
CREATE POLICY "member can select own wrap; admins select all" ON public.org_key_wrap
  FOR SELECT TO authenticated
  USING (
    member_id IN (SELECT id FROM public.member WHERE user_id = public.current_user_id())
    OR (SELECT public.is_organization_admin(org_id, public.current_user_id()))
  );

CREATE POLICY "admins can insert wrap" ON public.org_key_wrap
  FOR INSERT TO authenticated
  WITH CHECK (public.is_organization_admin(org_id, public.current_user_id()));

-- ORG_RECOVERY policies
CREATE POLICY "owners select org_recovery" ON public.org_recovery
  FOR SELECT TO authenticated
  USING (public.is_organization_owner(org_id, public.current_user_id()));

CREATE POLICY "owners upsert org_recovery" ON public.org_recovery
  FOR ALL TO authenticated
  USING (public.is_organization_owner(org_id, public.current_user_id()))
  WITH CHECK (public.is_organization_owner(org_id, public.current_user_id()));

-- AUDIT_LOG policies
CREATE POLICY "org members can select audit logs" ON public.audit_log
  FOR SELECT TO authenticated
  USING (org_id IN (SELECT organization_id FROM public.member WHERE user_id = public.current_user_id()));

-- MEMBER_DEVICE_KEY policies
CREATE POLICY "member can upsert own device key" ON public.member_device_key
  FOR ALL TO authenticated
  USING (user_id = public.current_user_id())
  WITH CHECK (user_id = public.current_user_id());

-- ROTATION tables policies
CREATE POLICY "org members can select rotation_job" ON public.rotation_job
  FOR SELECT TO authenticated
  USING (org_id IN (SELECT organization_id FROM public.member WHERE user_id = public.current_user_id()));

CREATE POLICY "admins mutate rotation_job" ON public.rotation_job
  FOR ALL TO authenticated
  USING (public.is_organization_admin(org_id, public.current_user_id()))
  WITH CHECK (public.is_organization_admin(org_id, public.current_user_id()));

CREATE POLICY "org members select rotation_approval" ON public.rotation_approval
  FOR SELECT TO authenticated
  USING (job_id IN (SELECT id FROM public.rotation_job rj WHERE rj.org_id IN (SELECT organization_id FROM public.member WHERE user_id = public.current_user_id())));

CREATE POLICY "admins insert rotation_approval" ON public.rotation_approval
  FOR INSERT TO authenticated
  WITH CHECK (job_id IN (SELECT id FROM public.rotation_job rj WHERE public.is_organization_admin(rj.org_id, public.current_user_id())));

CREATE POLICY "org members select rotation_progress" ON public.rotation_progress
  FOR SELECT TO authenticated
  USING (job_id IN (SELECT id FROM public.rotation_job rj WHERE rj.org_id IN (SELECT organization_id FROM public.member WHERE user_id = public.current_user_id())));

CREATE POLICY "admins update rotation_progress" ON public.rotation_progress
  FOR UPDATE TO authenticated
  USING (job_id IN (SELECT id FROM public.rotation_job rj WHERE public.is_organization_admin(rj.org_id, public.current_user_id())))
  WITH CHECK (job_id IN (SELECT id FROM public.rotation_job rj WHERE public.is_organization_admin(rj.org_id, public.current_user_id())));

CREATE POLICY "org members select rotation_key_wrap" ON public.rotation_key_wrap
  FOR SELECT TO authenticated
  USING (job_id IN (SELECT id FROM public.rotation_job rj WHERE rj.org_id IN (SELECT organization_id FROM public.member WHERE user_id = public.current_user_id())));

CREATE POLICY "admins insert rotation_key_wrap" ON public.rotation_key_wrap
  FOR INSERT TO authenticated
  WITH CHECK (job_id IN (SELECT id FROM public.rotation_job rj WHERE public.is_organization_admin(rj.org_id, public.current_user_id())));


