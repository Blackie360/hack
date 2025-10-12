import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { secret, project, member } from "@/db/schema";
import { getUserAndOrg } from "@/server/context";
import { logAudit } from "@/server/audit";
import { and, eq, inArray } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const ctx = await getUserAndOrg();
    if (!ctx.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { ids } = body ?? {};
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Missing ids array" }, { status: 400 });
    }
    // Verify all secrets belong to same project and user has access
    const secrets = await db.query.secret.findMany({ where: inArray(secret.id, ids) });
    if (secrets.length === 0) return NextResponse.json({ error: "No secrets found" }, { status: 404 });
    const projectId = secrets[0].projectId;
    if (!secrets.every(s => s.projectId === projectId)) {
      return NextResponse.json({ error: "All secrets must belong to same project" }, { status: 400 });
    }
    const proj = await db.query.project.findFirst({ where: eq(project.id, projectId) });
    if (!proj) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    const mem = await db.query.member.findFirst({ where: and(eq(member.userId, ctx.userId), eq(member.organizationId, proj.orgId)) });
    if (!mem) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // Only admins/owners can delete
    if (mem.role !== "owner" && mem.role !== "admin") {
      return NextResponse.json({ error: "Write access denied" }, { status: 403 });
    }
    await db.delete(secret).where(inArray(secret.id, ids));
    await logAudit(request, { action: "secret.bulk_delete", targetType: "secret", meta: { count: ids.length, projectId } });
    return NextResponse.json({ ok: true, deleted: ids.length });
  } catch (error) {
    console.error("POST /api/secrets/bulk-delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

