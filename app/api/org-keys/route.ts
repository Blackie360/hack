import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { member, orgKeyWrap } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const url = new URL(request.url);
  const fetchOwnerKey = url.searchParams.get("fetchOwnerKey") === "true";
  const orgIdParam = url.searchParams.get("orgId");
  
  const rows = await db.query.member.findMany({ where: eq(member.userId, session.user.id) });
  if (!rows.length) return NextResponse.json({ wrapped: null });
  const orgId = orgIdParam || rows[0].organizationId;
  
  // If fetching owner's key for re-wrapping
  if (fetchOwnerKey) {
    const ownerMember = await db.query.member.findFirst({
      where: and(eq(member.organizationId, orgId), eq(member.role, "owner")),
    });
    if (ownerMember) {
      const ownerWrap = await db.query.orgKeyWrap.findFirst({
        where: and(eq(orgKeyWrap.orgId, orgId), eq(orgKeyWrap.memberId, ownerMember.id)),
      });
      return NextResponse.json({
        ownerWrappedKey: ownerWrap ? { payloadB64: ownerWrap.wrappedKey } : null,
      });
    }
    return NextResponse.json({ ownerWrappedKey: null });
  }
  
  // Normal flow: fetch current member's wrapped key
  const wrap = await db.query.orgKeyWrap.findFirst({
    where: and(eq(orgKeyWrap.orgId, orgId), eq(orgKeyWrap.memberId, rows[0].id)),
  });
  return NextResponse.json({
    wrapped: wrap ? { payloadB64: wrap.wrappedKey } : null,
    member: { memberId: rows[0].id, orgId },
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { orgId, memberId, wrappedKey } = body ?? {};
  if (!orgId || !memberId || !wrappedKey) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await db.insert(orgKeyWrap).values({ id: crypto.randomUUID(), orgId, memberId, wrappedKey, createdAt: new Date() });
  return NextResponse.json({ ok: true });
}
