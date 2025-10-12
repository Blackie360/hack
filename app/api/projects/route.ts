import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { project, organization, member, projectMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { ensureDefaultEnvironments } from "@/server/environments";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { orgId, name, slug } = body ?? {};
  if (!orgId || !name || !slug) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Ensure organization exists; permission checks are enforced at UI level and by RLS for data access
  const org = await db.query.organization.findFirst({ where: eq(organization.id, orgId) });
  if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

  const id = crypto.randomUUID();
  await db.insert(project).values({ id, orgId, name, slug, createdAt: new Date() });
  // Add creator as first project member
  const me = await db.query.member.findFirst({
    where: (m, { and, eq }) => and(eq(m.userId, session.user.id), eq(m.organizationId, orgId)),
  });
  if (me) {
    try {
      await db.insert(projectMember).values({
        id: crypto.randomUUID(),
        projectId: id,
        memberId: me.id,
        role: "member",
        createdAt: new Date(),
      });
    } catch (e) {
      // If the table doesn't exist (migrations not applied), don't block project creation.
      // Owners will still have access; members can be assigned after migrations are applied.
      console.error("project_member insert failed (likely migrations not applied)", e);
    }
  }
  await ensureDefaultEnvironments(id);
  return NextResponse.json({ ok: true, project: { id, slug } });
}


