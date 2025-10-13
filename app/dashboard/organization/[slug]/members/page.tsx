import { getOrganizationBySlug } from "@/server/organizations";
import MembersTable from "@/components/members-table";
import { InviteMemberForm } from "@/components/invite-member-form";
import { Card } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

type Params = Promise<{ slug: string }>;

export default async function MembersPage({ params }: { params: Params }) {
  const { slug } = await params;
  
  let organization;
  try {
    organization = await getOrganizationBySlug(slug);
  } catch (error) {
    console.error("Error fetching organization:", error);
  }

  if (!organization) {
    return (
      <div className="space-y-4 p-4">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon" />
            <EmptyTitle>Organization Not Found</EmptyTitle>
            <EmptyDescription>This organization doesn't exist or you don't have access.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold">Team Members</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Current Members */}
        <Card className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Current Members</h2>
          <MembersTable members={organization.members || []} />
        </Card>

        {/* Invite New Member */}
        <div>
          <InviteMemberForm organizationId={organization.id} />
        </div>
      </div>
    </div>
  );
}

