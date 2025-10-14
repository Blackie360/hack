import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { invitation, member, session as sessionTable } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ invitationId: string }> }
) {
    const { invitationId } = await params;

    try {
        // Get the current session
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json(
                { error: "You must be logged in to accept an invitation" },
                { status: 401 }
            );
        }

        // Get the invitation
        const invitationRecord = await db.query.invitation.findFirst({
            where: (invitations, { eq }) => eq(invitations.id, invitationId),
        });

        if (!invitationRecord) {
            return NextResponse.json(
                { error: "Invitation not found" },
                { status: 404 }
            );
        }

        // Check if invitation is expired
        if (new Date() > invitationRecord.expiresAt) {
            return NextResponse.json(
                { error: "Invitation has expired" },
                { status: 400 }
            );
        }

        // Check if invitation is pending
        if (invitationRecord.status !== "pending") {
            return NextResponse.json(
                { error: "Invitation has already been processed" },
                { status: 400 }
            );
        }

        // Check if user's email matches the invitation email
        if (session.user.email !== invitationRecord.email) {
            return NextResponse.json(
                { error: "This invitation was sent to a different email address" },
                { status: 403 }
            );
        }

        // Check if user is already a member
        const existingMember = await db.query.member.findFirst({
            where: (members, { and, eq }) => and(
                eq(members.userId, session.user.id),
                eq(members.organizationId, invitationRecord.organizationId)
            ),
        });

        if (existingMember) {
            // Update invitation status to accepted
            await db.update(invitation)
                .set({ status: "accepted" })
                .where(eq(invitation.id, invitationId));

            return NextResponse.json({
                success: true,
                message: "You are already a member of this organization",
            });
        }

        // Create membership
        const memberId = `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await db.insert(member).values({
            id: memberId,
            userId: session.user.id,
            organizationId: invitationRecord.organizationId,
            role: invitationRecord.role,
            createdAt: new Date(),
        });

    // Update invitation status
    await db.update(invitation)
      .set({ status: "accepted" })
      .where(eq(invitation.id, invitationId));

    // Set this organization as the active organization in the session
    await db.update(sessionTable)
      .set({ activeOrganizationId: invitationRecord.organizationId })
      .where(eq(sessionTable.userId, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Invitation accepted successfully",
      organizationId: invitationRecord.organizationId,
    });

    } catch (error) {
        console.error("Accept invitation error:", error);
        return NextResponse.json(
            { error: "Failed to accept invitation" },
            { status: 500 }
        );
    }
}