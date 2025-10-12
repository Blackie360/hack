import UnlockGate from "@/components/security/unlock-gate";
import SecretTable from "@/components/secrets/secret-table";
import { getOrganizationBySlug } from "@/server/organizations";
import { db } from "@/db/drizzle";
import { project, projectMember, member } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import ProjectSelector from "@/components/secrets/project-selector";
import EnvEditor from "@/components/secrets/env-editor";
import EnvTabs from "@/components/secrets/env-tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SecretsPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ projectId?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const org = await getOrganizationBySlug(slug);
  if (!org) return null;
  const projects = await db.query.project.findMany({ where: eq(project.orgId, org.id) });
  const selectedProjectId = sp.projectId || projects[0]?.id;

  if (!selectedProjectId) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon" />
            <EmptyTitle>Select a project</EmptyTitle>
            <EmptyDescription>Create a project first, then choose it to view secrets.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const environmentId = (sp.env as string) || "dev";

  return (
    <UnlockGate>
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Secrets</h1>
          <div className="flex gap-3 items-center">
            <ProjectSelector slug={slug} projects={projects} selectedProjectId={selectedProjectId} />
            <Button variant="outline" asChild>
              <Link href={`/dashboard/organization/${slug}/projects#${selectedProjectId}`}>Assign Members</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <EnvTabs slug={slug} projectId={selectedProjectId} current={environmentId} />
        </div>
        <EnvEditor projectId={selectedProjectId} environmentId={environmentId} />
        <SecretTable projectId={selectedProjectId} environmentId={environmentId} />
      </div>
    </UnlockGate>
  );
}


