import { getOrganizationBySlug } from "@/server/organizations";
import { db } from "@/db/drizzle";
import { project } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProjectsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) return null;
  const projects = await db.query.project.findMany({ where: eq(project.orgId, org.id) });

  return (
    <div className="space-y-4 md:space-y-6 py-2 md:py-4">
      <h1 className="text-xl md:text-2xl font-semibold">Projects</h1>
      <p className="text-sm text-muted-foreground">All organization members have access to all projects.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {projects.map((p) => (
          <Card key={p.id} className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <div className="font-medium text-sm md:text-base">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.slug}</div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/organization/${slug}/secrets?projectId=${p.id}`}>
                  View Secrets
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

