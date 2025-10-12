-- Allow org members to self-assign to a project within that org
CREATE POLICY IF NOT EXISTS "member self-assign"
ON public.project_member
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.member m
    JOIN public.project p ON p.id = project_member.project_id
    WHERE m.id = project_member.member_id
      AND m.user_id = public.current_user_id()
      AND m.organization_id = p.org_id
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.project_member pm2
    WHERE pm2.project_id = project_member.project_id
      AND pm2.member_id = project_member.member_id
  )
);

