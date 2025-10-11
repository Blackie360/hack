import MembersTable from "@/components/members-table";
import { InviteMemberForm } from "@/components/invite-member-form";
import { getOrganizationBySlug } from "@/server/organizations";

type Params = Promise<{ slug: string }>;

export default async function OrganizationPage({ params }: { params: Params }) {
  const { slug } = await params;

  const organization = await getOrganizationBySlug(slug);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{organization?.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Members */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Current Members</h2>
          <MembersTable members={organization?.members || []} />
        </div>

        {/* Right Column - Invite Form */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Invite Members</h2>
          <InviteMemberForm organizationId={organization?.id || ""} />
        </div>
      </div>
    </div>
  );
}
