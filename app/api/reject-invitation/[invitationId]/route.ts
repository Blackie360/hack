import { db } from "@/db/drizzle";
import { invitation } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ invitationId: string }> }
) {
    const { invitationId } = await params;

    try {
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

        // Check if invitation is pending
        if (invitationRecord.status !== "pending") {
            return NextResponse.json(
                { error: "Invitation has already been processed" },
                { status: 400 }
            );
        }

        // Update invitation status to rejected
        await db.update(invitation)
            .set({ status: "rejected" })
            .where(eq(invitation.id, invitationId));

        return NextResponse.json({
            success: true,
            message: "Invitation rejected",
        });

    } catch (error) {
        console.error("Reject invitation error:", error);
        return NextResponse.json(
            { error: "Failed to reject invitation" },
            { status: 500 }
        );
    }
}

