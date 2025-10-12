import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { member, project, projectMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { projectId, memberId, role } = body ?? {};
  if (!projectId || !memberId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Check admin privilege in org of the project
  const proj = await db.query.project.findFirst({ where: eq(project.id, projectId) });
  if (!proj) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  const mem = await db.query.member.findFirst({ where: and(eq(member.userId, session.user.id), eq(member.organizationId, proj.orgId)) });
  if (!mem || (mem.role !== "owner" && mem.role !== "admin")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.insert(projectMember).values({ id: crypto.randomUUID(), projectId, memberId, role: role ?? "member", createdAt: new Date() });
  return NextResponse.json({ ok: true });
}


