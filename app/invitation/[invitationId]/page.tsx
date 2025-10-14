import { db } from "@/db/drizzle";
import { member, session as sessionTable, invitation as invitationTable } from "@/db/schema";
import { InvitationAcceptance } from "@/components/invitation-acceptance";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { eq } from "drizzle-orm";

interface InvitationPageProps {
  params: Promise<{ invitationId: string }>;
  searchParams: Promise<{ accepted?: string }>;
}

export default async function InvitationPage({ params, searchParams }: InvitationPageProps) {
  const { invitationId } = await params;
  const { accepted } = await searchParams;

  // Get the invitation details
  const invitation = await db.query.invitation.findFirst({
    where: (invitations, { eq }) => eq(invitations.id, invitationId),
    with: {
      organization: true,
      inviter: true,
    },
  });

  // If invitation not found or expired
  if (!invitation) {
    notFound();
  }

  // Check if invitation is expired
  if (new Date() > invitation.expiresAt) {
    return (
      <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              Invitation Expired
            </h1>
            <p className="text-muted-foreground">
              This invitation has expired. Please contact the organization administrator for a new invitation.
            </p>
            <Link href="/" className="inline-block">
              <Button>
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if invitation was already accepted/rejected
  if (invitation.status !== "pending") {
    return (
      <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">
              Invitation Already {invitation.status === "accepted" ? "Accepted" : "Rejected"}
            </h1>
            <p className="text-muted-foreground">
              This invitation has already been {invitation.status}.
            </p>
            <a
              href="/dashboard"
              className="inline-block"
            >
              <Button>
                Go to Dashboard
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is already logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If logged in, check if the email matches
  const isLoggedIn = !!session?.user;
  const emailMatches = session?.user?.email === invitation.email;

  // If user just came from login/signup and email matches, auto-accept
  if (accepted === "true" && isLoggedIn && emailMatches && invitation.status === "pending") {
    // Auto-accept the invitation
    const memberId = `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create membership
    await db.insert(member).values({
      id: memberId,
      userId: session.user.id,
      organizationId: invitation.organizationId,
      role: invitation.role,
      createdAt: new Date(),
    });

    // Update invitation status
    await db.update(invitationTable)
      .set({ status: "accepted" })
      .where(eq(invitationTable.id, invitationId));

    // Set this organization as the active organization in the session
    await db.update(sessionTable)
      .set({ activeOrganizationId: invitation.organizationId })
      .where(eq(sessionTable.userId, session.user.id));

    // Redirect to the specific organization's dashboard
    redirect(`/dashboard/organization/${invitation.organization.slug}`);
  }

  return (
    <InvitationAcceptance
      invitation={{
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        organizationName: invitation.organization.name,
        organizationLogo: invitation.organization.logo,
        inviterName: invitation.inviter.name,
        inviterEmail: invitation.inviter.email,
        expiresAt: invitation.expiresAt.toISOString(),
      }}
      isLoggedIn={isLoggedIn}
      emailMatches={emailMatches}
    />
  );
}

