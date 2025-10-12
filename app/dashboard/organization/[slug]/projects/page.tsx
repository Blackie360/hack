import { getOrganizationBySlug } from "@/server/organizations";
import { db } from "@/db/drizzle";
import { member, project, projectMember, user } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
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
  
  // Avoid lateral joins: use plain selects
  let assignedAll: Array<{ id: string; projectId: string; memberId: string; role: string; member?: any }> = [];
  try {
    if (projects.length) {
      const pmRaw = await db.select().from(projectMember).where(inArray(projectMember.projectId, projects.map((p) => p.id)));
      // enrich with member/user data manually
      for (const pm of pmRaw) {
        const m = members.find((mem) => mem.id === pm.memberId);
        assignedAll.push({ ...pm, member: m ? { ...m, user: m.user } : null });
      }
    }
  } catch {}
  
  const projectIdToAssignments = new Map<string, typeof assignedAll>();
  for (const a of assignedAll) {
    const arr = projectIdToAssignments.get(a.projectId) ?? [];
    arr.push(a);
    projectIdToAssignments.set(a.projectId, arr);
  }

  return (
    <div className="space-y-4 md:space-y-6 py-2 md:py-4">
      <h1 className="text-xl md:text-2xl font-semibold">Projects</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {projects.map((p) => {
          const assigned = (projectIdToAssignments.get(p.id) as any[]) ?? [];
          return (
            <Card key={p.id} className="p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <div className="font-medium text-sm md:text-base">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.slug}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{assigned.length} member{assigned.length !== 1 ? 's' : ''}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Members</div>
                <div className="flex flex-wrap gap-2">
                  {assigned.length === 0 ? (
                    <div className="text-xs text-muted-foreground">No members assigned</div>
                  ) : (
                    assigned.map(a => (
                      <div key={a.id} className="text-xs rounded-md border px-2 py-1 bg-muted/30">
                        {a.member?.user?.name ?? "Unknown"} <span className="text-muted-foreground">({a.member?.role ?? "member"})</span>
                      </div>
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

