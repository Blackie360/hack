import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { secret, project, member } from "@/db/schema";
import { getUserAndOrg } from "@/server/context";
import { logAudit } from "@/server/audit";
import { and, eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getUserAndOrg();
  if (!ctx.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const sec = await db.query.secret.findFirst({ where: eq(secret.id, id) });
  if (!sec) return NextResponse.json({ error: "Secret not found" }, { status: 404 });
  // Verify user is a member of the org
  const proj = await db.query.project.findFirst({ where: eq(project.id, sec.projectId) });
  if (!proj) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  const mem = await db.query.member.findFirst({ where: and(eq(member.userId, ctx.userId), eq(member.organizationId, proj.orgId)) });
  if (!mem) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // All org members can access all projects
  return NextResponse.json({ secret: sec });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await getUserAndOrg();
    if (!ctx.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await request.json();
    const { ciphertext, nonce, aad } = body ?? {};
    if (!ciphertext || !nonce) return NextResponse.json({ error: "Missing ciphertext or nonce" }, { status: 400 });
    const sec = await db.query.secret.findFirst({ where: eq(secret.id, id) });
    if (!sec) return NextResponse.json({ error: "Secret not found" }, { status: 404 });
    const proj = await db.query.project.findFirst({ where: eq(project.id, sec.projectId) });
    if (!proj) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    const mem = await db.query.member.findFirst({ where: and(eq(member.userId, ctx.userId), eq(member.organizationId, proj.orgId)) });
    if (!mem) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // Only admins/owners can edit
    if (mem.role !== "owner" && mem.role !== "admin") {
      return NextResponse.json({ error: "Write access denied" }, { status: 403 });
    }
    await db.update(secret).set({ ciphertext, nonce, aad: aad ?? null }).where(eq(secret.id, id));
    await logAudit(request, { action: "secret.update", targetType: "secret", targetId: id, meta: { name: sec.name } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH /api/secrets/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ctx = await getUserAndOrg();
    if (!ctx.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const sec = await db.query.secret.findFirst({ where: eq(secret.id, id) });
    if (!sec) return NextResponse.json({ error: "Secret not found" }, { status: 404 });
    const proj = await db.query.project.findFirst({ where: eq(project.id, sec.projectId) });
    if (!proj) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    const mem = await db.query.member.findFirst({ where: and(eq(member.userId, ctx.userId), eq(member.organizationId, proj.orgId)) });
    if (!mem) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // Only admins/owners can delete
    if (mem.role !== "owner" && mem.role !== "admin") {
      return NextResponse.json({ error: "Write access denied" }, { status: 403 });
    }
    await db.delete(secret).where(eq(secret.id, id));
    await logAudit(request, { action: "secret.delete", targetType: "secret", targetId: id, meta: { name: sec.name } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/secrets/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

