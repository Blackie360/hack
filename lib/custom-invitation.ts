import { db } from "@/db/drizzle";
import { invitation, type Role } from "@/db/schema";
import { sendEmail } from "./email";
import OrganizationInvitationEmail from "@/components/emails/organization-invitation";

export async function createCustomInvitation({
  email,
  role,
  organizationId,
  inviterId,
}: {
  email: string;
  role: Role;
  organizationId: string;
  inviterId: string;
}) {
  try {
    // Generate invitation ID
    const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create invitation directly in database
    const newInvitation = await db.insert(invitation).values({
      id: invitationId,
      email,
      organizationId,
      inviterId,
      role,
      status: 'pending',
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    }).returning();

    if (newInvitation.length === 0) {
      throw new Error('Failed to create invitation');
    }

    // Get organization and inviter details for email
    const organization = await db.query.organization.findFirst({
      where: (orgs, { eq }) => eq(orgs.id, organizationId)
    });

    const inviter = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.id, inviterId)
    });

    if (!organization || !inviter) {
      throw new Error('Organization or inviter not found');
    }

    // Send invitation email
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${invitationId}`;
    
    await sendEmail({
      to: email,
      subject: "You've been invited to join our organization",
      react: OrganizationInvitationEmail({
        email,
        invitedByUsername: inviter.name,
        invitedByEmail: inviter.email,
        teamName: organization.name,
        inviteLink
      })
    });

    return {
      success: true,
      invitation: newInvitation[0],
      message: 'Invitation sent successfully'
    };

  } catch (error) {
    console.error('Custom invitation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

