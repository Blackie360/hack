import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { session } from "@/db/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const currentSession = await auth.api.getSession({
      headers: await headers(),
    });

    if (!currentSession) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const { organizationId } = await request.json();

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Update the session with the new active organization
    await db.update(session)
      .set({ activeOrganizationId: organizationId })
      .where(eq(session.id, currentSession.session.id));

    return NextResponse.json({
      success: true,
      message: "Active organization updated",
    });

  } catch (error) {
    console.error("Set active organization error:", error);
    return NextResponse.json(
      { error: "Failed to update active organization" },
      { status: 500 }
    );
  }
}
