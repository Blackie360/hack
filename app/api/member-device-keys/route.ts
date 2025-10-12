import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { member, memberDeviceKey } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { publicKeyB64 } = body ?? {};
  if (!publicKeyB64) return NextResponse.json({ error: "Missing publicKeyB64" }, { status: 400 });

  // Pick first membership for now; future: use active org
  const mem = await db.query.member.findFirst({ where: eq(member.userId, session.user.id) });
  if (!mem) return NextResponse.json({ error: "No membership" }, { status: 400 });

  // Upsert by (memberId)
  const existing = await db.query.memberDeviceKey.findFirst({ where: eq(memberDeviceKey.memberId, mem.id) });
  if (existing) {
    await db.update(memberDeviceKey)
      .set({ publicKeyB64 })
      .where(eq(memberDeviceKey.id, existing.id));
  } else {
    await db.insert(memberDeviceKey).values({
      id: crypto.randomUUID(),
      orgId: mem.organizationId,
      memberId: mem.id,
      userId: mem.userId,
      publicKeyB64,
      createdAt: new Date(),
    });
  }
  return NextResponse.json({ ok: true });
}


