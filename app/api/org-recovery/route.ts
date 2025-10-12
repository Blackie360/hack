import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { member, orgRecovery } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const mem = await db.query.member.findFirst({ where: eq(member.userId, session.user.id) });
  if (!mem) return NextResponse.json({ recovery: null });
  const rec = await db.query.orgRecovery.findFirst({ where: eq(orgRecovery.orgId, mem.organizationId) });
  if (!rec) return NextResponse.json({ recovery: null });
  return NextResponse.json({ recovery: { wrappedKeyByKEK: rec.wrappedKeyByKEK, params: rec.params } });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const mem = await db.query.member.findFirst({ where: eq(member.userId, session.user.id) });
  if (!mem) return NextResponse.json({ error: "No membership" }, { status: 400 });
  const body = await request.json();
  const { wrappedKeyByKEK, params } = body ?? {};
  if (!wrappedKeyByKEK || !params) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const existing = await db.query.orgRecovery.findFirst({ where: eq(orgRecovery.orgId, mem.organizationId) });
  if (existing) {
    await db.update(orgRecovery).set({ wrappedKeyByKEK, params, updatedAt: new Date() }).where(eq(orgRecovery.id, existing.id));
  } else {
    await db.insert(orgRecovery).values({ id: crypto.randomUUID(), orgId: mem.organizationId, wrappedKeyByKEK, params, updatedAt: new Date() });
  }
  return NextResponse.json({ ok: true });
}


