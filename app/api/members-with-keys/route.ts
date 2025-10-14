import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { member, orgKeyWrap } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Get current user's membership
    const rows = await db.query.member.findMany({ 
      where: eq(member.userId, session.user.id),
      with: { user: true }
    });
    
    if (!rows.length) {
      return NextResponse.json({ error: "Not a member" }, { status: 403 });
    }

    const currentMember = rows[0];
    const orgId = currentMember.organizationId;

    // Fetch all members in the org
    const allMembers = await db.query.member.findMany({
      where: eq(member.organizationId, orgId),
      with: { user: true }
    });

    // Fetch all wrapped keys for this org
    const wrappedKeys = await db.select().from(orgKeyWrap).where(eq(orgKeyWrap.orgId, orgId));

    // Map members with their wrapped key status
    const membersWithKeys = allMembers.map(m => ({
      id: m.id,
      email: m.user.email,
      role: m.role,
      hasWrappedKey: wrappedKeys.some(wk => wk.memberId === m.id)
    }));

    return NextResponse.json({ 
      orgId,
      members: membersWithKeys 
    });
  } catch (error) {
    console.error("Fetch members-with-keys error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

