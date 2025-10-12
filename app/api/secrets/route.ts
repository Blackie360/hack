import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { member, project, projectMember, secret } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getUserAndOrg } from "@/server/context";
import { logAudit } from "@/server/audit";
import { and, eq, inArray } from "drizzle-orm";

export async function GET(request: Request) {
  const ctx = await getUserAndOrg();
  if (!ctx.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const environmentId = searchParams.get("environmentId");
  if (!projectId || !environmentId) {
    return NextResponse.json({ error: "Missing projectId or environmentId" }, { status: 400 });
  }
  // Enforce project membership: owner sees all
  const proj = await db.query.project.findFirst({ where: eq(project.id, projectId) });
  if (!proj) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  const mem = await db.query.member.findFirst({ where: and(eq(member.userId, ctx.userId), eq(member.organizationId, proj.orgId)) });
  if (!mem) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (mem.role !== "owner") {
    const pms = await db.query.projectMember.findMany({ where: and(eq(projectMember.projectId, projectId), eq(projectMember.memberId, mem.id)) });
    if (pms.length === 0) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const list = await db.query.secret.findMany({
    where: (row, { eq, and }) => and(eq(row.projectId, projectId), eq(row.environmentId, environmentId)),
    columns: {
      id: true,
      name: true,
      ciphertext: true,
      nonce: true,
      aad: true,
      version: true,
      expiresAt: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ secrets: list });
}

export async function POST(request: Request) {
  const ctx = await getUserAndOrg();
  if (!ctx.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { projectId, environmentId, name, ciphertext, nonce, aad, version, expiresAt } = body ?? {};
  if (!projectId || !environmentId || !name || !ciphertext || !nonce || !version) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const proj = await db.query.project.findFirst({ where: eq(project.id, projectId) });
  if (!proj) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  const mem = await db.query.member.findFirst({ where: and(eq(member.userId, ctx.userId), eq(member.organizationId, proj.orgId)) });
  if (!mem) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (mem.role !== "owner") {
    const pms = await db.query.projectMember.findMany({ where: and(eq(projectMember.projectId, projectId), eq(projectMember.memberId, mem.id)) });
    if (pms.length === 0) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await db.insert(secret).values({
    id: crypto.randomUUID(),
    projectId,
    environmentId,
    name,
    ciphertext,
    nonce,
    aad: aad ?? null,
    version,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    createdBy: ctx.userId,
    createdAt: new Date(),
  });
  await logAudit(request, { action: "secret.create", targetType: "secret", meta: { projectId, environmentId, name } });
  return NextResponse.json({ ok: true });
}
