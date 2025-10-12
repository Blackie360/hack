import { getOrganizationBySlug } from "@/server/organizations";
import { db } from "@/db/drizzle";
import { member, project, projectMember, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AssignMember from "@/components/projects/assign-member";
import { Badge } from "@/components/ui/badge";

export default async function ProjectsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) return null;
  const projects = await db.query.project.findMany({ where: eq(project.orgId, org.id) });
  const members = await db.query.member.findMany({ where: eq(member.organizationId, org.id), with: { user: true } });

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(async (p) => {
          const assigned = await db.query.projectMember.findMany({ where: eq(projectMember.projectId, p.id), with: { member: { with: { user: true } } } });
          return (
            <Card key={p.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.slug}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{assigned.length} members</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Members</div>
                <div className="flex flex-wrap gap-2">
                  {assigned.length === 0 ? (
                    <div className="text-xs text-muted-foreground">No members assigned</div>
                  ) : (
                    assigned.map(a => (
                      <div key={a.id} className="text-xs rounded-md border px-2 py-1">{a.member.user.name} ({a.member.role})</div>
                    ))
                  )}
                </div>
              </div>
              <AssignMember projectId={p.id} options={members.filter(m => !assigned.some(a => a.memberId === m.id)).map(m => ({ memberId: m.id, name: m.user.name }))} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

