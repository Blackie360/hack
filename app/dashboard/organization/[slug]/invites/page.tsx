import { InviteMemberForm } from "@/components/invite-member-form";
import { getOrganizationBySlug } from "@/server/organizations";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default async function InvitesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);
  return (
    <div className="space-y-4 py-4">
      <h1 className="text-2xl font-semibold">Invites</h1>
      <p className="text-sm text-muted-foreground">Invite collaborators by email and assign roles.</p>
      <InviteMemberForm organizationId={organization?.id || ""} />
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon" />
          <EmptyTitle>No pending invites</EmptyTitle>
          <EmptyDescription>New invitations will appear here once sent.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}


