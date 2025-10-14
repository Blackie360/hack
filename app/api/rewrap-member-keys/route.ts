import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { member, orgKeyWrap, memberDeviceKey } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

/**
 * Owner can fetch all members' device public keys and re-wrap the org key for them
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Get current user's membership
    const rows = await db.query.member.findMany({ 
      where: eq(member.userId, session.user.id) 
    });
    if (!rows.length) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 });
    }

    const currentMember = rows[0];
    
    // Only owner can re-wrap keys
    if (currentMember.role !== "owner") {
      return NextResponse.json({ error: "Only owner can re-wrap keys" }, { status: 403 });
    }

    const body = await request.json();
    const { orgKeyB64, targetMemberIds } = body ?? {};
    
    if (!orgKeyB64 || !Array.isArray(targetMemberIds)) {
      return NextResponse.json({ error: "Missing orgKeyB64 or targetMemberIds" }, { status: 400 });
    }

    // Decode the org key
    const orgKey = Uint8Array.from(atob(orgKeyB64), c => c.charCodeAt(0));
    
    // Fetch device public keys for target members
    const deviceKeys = await db.query.memberDeviceKey.findMany({
      where: eq(memberDeviceKey.orgId, currentMember.organizationId)
    });

    const results = [];
    
    for (const targetMemberId of targetMemberIds) {
      const deviceKey = deviceKeys.find(dk => dk.memberId === targetMemberId);
      if (!deviceKey) {
        results.push({ memberId: targetMemberId, success: false, error: "No device key" });
        continue;
      }

      try {
        // Import the seal function on server side
        const { sealedBoxEncrypt } = await import("@/lib/crypto/box");
        const { payloadB64 } = sealedBoxEncrypt(deviceKey.publicKeyB64, orgKey);
        
        // Check if wrapped key already exists
        const existing = await db.query.orgKeyWrap.findFirst({
          where: and(
            eq(orgKeyWrap.orgId, currentMember.organizationId),
            eq(orgKeyWrap.memberId, targetMemberId)
          )
        });

        if (existing) {
          // Update existing
          await db
            .update(orgKeyWrap)
            .set({ wrappedKey: payloadB64, createdAt: new Date() })
            .where(eq(orgKeyWrap.id, existing.id));
        } else {
          // Insert new
          await db.insert(orgKeyWrap).values({
            id: crypto.randomUUID(),
            orgId: currentMember.organizationId,
            memberId: targetMemberId,
            wrappedKey: payloadB64,
            createdAt: new Date()
          });
        }
        
        results.push({ memberId: targetMemberId, success: true });
      } catch (error) {
        results.push({ memberId: targetMemberId, success: false, error: String(error) });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Re-wrap error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

