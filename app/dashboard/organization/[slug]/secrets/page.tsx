import SecretTable from "@/components/secrets/secret-table";
import { getOrganizationBySlug } from "@/server/organizations";
import { getUserAndOrg } from "@/server/context";
import { db } from "@/db/drizzle";
import { project, projectMember, member } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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
  const ctx = await getUserAndOrg();
  const userMember = await db.query.member.findFirst({ where: and(eq(member.userId, ctx.userId!), eq(member.organizationId, org.id)) });
  const userRole = userMember?.role;
  const projects = await db.query.project.findMany({ where: eq(project.orgId, org.id) });
  const selectedProjectId = sp.projectId || projects[0]?.id;

  if (!selectedProjectId) {
    return (
      <div className="px-4 py-6 md:py-10">
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Secrets</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
          <ProjectSelector slug={slug} projects={projects} selectedProjectId={selectedProjectId} />
          <Button variant="outline" asChild size="sm" className="w-full sm:w-auto">
            <Link href={`/dashboard/organization/${slug}/secrets/cleanup?projectId=${selectedProjectId}&env=${environmentId}`}>
              <span className="hidden sm:inline">Cleanup Tool</span>
              <span className="sm:hidden">Cleanup</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <EnvTabs slug={slug} projectId={selectedProjectId} current={environmentId} />
      </div>
      <EnvEditor projectId={selectedProjectId} environmentId={environmentId} />
      <SecretTable projectId={selectedProjectId} environmentId={environmentId} userRole={userRole} />
    </div>
  );
}


