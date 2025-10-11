import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCustomInvitation } from "@/lib/custom-invitation";
import { db } from "@/db/drizzle";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, role, organizationId } = body;

    // Validate required fields
    if (!email || !role || !organizationId) {
      return NextResponse.json(
        { error: "Missing required fields: email, role, organizationId" },
        { status: 400 }
      );
    }

    // Check if user has permission to invite to this organization
    // Query the database directly to check membership and role
    const membership = await db.query.member.findFirst({
      where: (members, { and, eq }) => and(
        eq(members.userId, session.user.id),
        eq(members.organizationId, organizationId)
      ),
      with: {
        organization: true
      }
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    // Check if user has owner or admin role
    if (membership.role !== 'owner' && membership.role !== 'admin') {
      return NextResponse.json(
        { error: "Only owners and admins can invite members" },
        { status: 403 }
      );
    }

    // Create the invitation
    const result = await createCustomInvitation({
      email,
      role,
      organizationId,
      inviterId: session.user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      invitation: result.invitation,
    });

  } catch (error) {
    console.error("Invite member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
