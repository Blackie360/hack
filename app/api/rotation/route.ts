import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { member, rotationJob, rotationProgress } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { logAudit } from "@/server/audit";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const mem = await db.query.member.findFirst({ where: eq(member.userId, session.user.id) });
  if (!mem) return NextResponse.json({ error: "No membership" }, { status: 400 });
  const { requiredApprovals } = await request.json();

  const jobId = crypto.randomUUID();
  await db.insert(rotationJob).values({
    id: jobId,
    orgId: mem.organizationId,
    initiatorId: session.user.id,
    status: "pending",
    requiredApprovals: JSON.stringify(requiredApprovals || { owners: 1, admins: 1 }),
    approvalsCount: '0',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await db.insert(rotationProgress).values({ id: crypto.randomUUID(), jobId, processedCount: '0', totalCount: '0', updatedAt: new Date() });
  await logAudit(request, { action: "rotation.create", targetType: "rotation_job", targetId: jobId });
  return NextResponse.json({ jobId });
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { jobId, action } = await request.json();
  if (!jobId || !action) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const updates: Record<string, "pending" | "active" | "paused" | "completed" | "rolled_back" | "failed"> = { paused: "paused", resume: "active", complete: "completed", rollback: "rolled_back" };
  const status = updates[action];
  if (!status) return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  await db.update(rotationJob).set({ status, updatedAt: new Date() }).where(eq(rotationJob.id, jobId));
  await logAudit(request, { action: `rotation.${action}`, targetType: "rotation_job", targetId: jobId });
  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const mem = await db.query.member.findFirst({ where: eq(member.userId, session.user.id) });
  if (!mem) return NextResponse.json({ jobs: [] });
  const jobs = await db.query.rotationJob.findMany({ where: eq(rotationJob.orgId, mem.organizationId) });
  return NextResponse.json({ jobs });
}


