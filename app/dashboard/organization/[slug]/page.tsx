import MembersTable from "@/components/members-table";
import { InviteMemberForm } from "@/components/invite-member-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getOrganizationBySlug } from "@/server/organizations";
import { getAccessibleProjects } from "@/server/projects";
import { KeyRound, Users, Mail, ShieldCheck, Settings2 } from "lucide-react";
import CreateProjectDialog from "@/components/projects/create-project-dialog";
import PendingOnboardingBanner from "@/components/security/pending-onboarding-banner";

type Params = Promise<{ slug: string }>;

export default async function OrganizationPage({ params }: { params: Params }) {
  const { slug } = await params;

  const organization = await getOrganizationBySlug(slug);
  const projects = organization ? await getAccessibleProjects(organization.id) : [];

  return (
    <div className="space-y-4 md:space-y-6 py-2 md:py-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">{organization?.name}</h1>
      </div>

      <PendingOnboardingBanner />

      {/* Projects list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold">Projects</h2>
          {organization?.id ? (
            <CreateProjectDialog orgId={organization.id} />
          ) : null}
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet. Owners can create projects and assign members.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.map((p) => (
              <Card key={p.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.slug}</div>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                  <Link href={`./${slug}/secrets`}>Open</Link>
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 auto-rows-auto md:auto-rows-[minmax(140px,_auto)]">
        {/* Secrets - large tile */}
        <Card className="p-4 md:p-6 sm:col-span-2 md:col-span-4 md:row-span-2 flex flex-col justify-between bg-card/70">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">Manage Secrets</h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">Create, import, and version environment variables with end‑to‑end encryption.</p>
          <div>
            <Button variant="outline" asChild size="sm" className="w-full sm:w-auto">
              <Link href={`./${slug}/secrets`}>Go to Secrets</Link>
            </Button>
          </div>
        </Card>

        {/* Members */}
        <Card className="p-4 md:p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">Members</h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">View members and roles. Invite collaborators securely.</p>
          <Button variant="outline" asChild size="sm" className="w-full">
            <Link href={`./${slug}/members`}>Manage Members</Link>
          </Button>
        </Card>

        {/* Invites */}
        <Card className="p-4 md:p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">Invites</h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">Send and track invitations to your organization.</p>
          <Button variant="outline" asChild size="sm" className="w-full">
            <Link href={`./${slug}/invites`}>Open Invites</Link>
          </Button>
        </Card>

        {/* Audit */}
        <Card className="p-4 md:p-6 md:col-span-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">Audit Log</h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">Review actions across your organization.</p>
          <Button variant="outline" asChild size="sm" className="w-full">
            <Link href={`./${slug}/audit`}>View Audit</Link>
          </Button>
        </Card>

        {/* Settings */}
        <Card className="p-4 md:p-6 md:col-span-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
              <Settings2 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm md:text-base">Settings</h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">Recovery passphrase and key rotation.</p>
          <Button variant="outline" asChild size="sm" className="w-full">
            <Link href={`./${slug}/settings`}>Open Settings</Link>
          </Button>
        </Card>
      </div>

      {/* Members and Invite Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-3 md:space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Current Members</h2>
          <MembersTable members={organization?.members || []} />
        </div>

        <div className="space-y-3 md:space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Invite Members</h2>
          <InviteMemberForm organizationId={organization?.id || ""} />
        </div>
      </div>
    </div>
  );
}
