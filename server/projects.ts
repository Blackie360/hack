"use server";

import { db } from "@/db/drizzle";
import { member, project, projectMember } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq, inArray } from "drizzle-orm";

export async function getAccessibleProjects(orgId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const mem = await db.query.member.findFirst({
    where: and(eq(member.userId, session.user.id), eq(member.organizationId, orgId)),
  });
  if (!mem) return [];

  // Owner sees all projects
  if (mem.role === "owner") {
    return await db.query.project.findMany({ where: eq(project.orgId, orgId) });
  }

  // For admins/members: get all projects in org
  const allProjects = await db.query.project.findMany({ where: eq(project.orgId, orgId) });
  if (allProjects.length === 0) return [];

  // Check which projects have assignments
  const projectIds = allProjects.map((p) => p.id);
  let allAssignments: Array<{ projectId: string; memberId: string }> = [];
  try {
    allAssignments = await db
      .select({ projectId: projectMember.projectId, memberId: projectMember.memberId })
      .from(projectMember)
      .where(inArray(projectMember.projectId, projectIds));
  } catch (e) {
    // If RLS blocks, assume no assignments
  }

  // Build map of projectId → assigned member IDs
  const projectAssignments = new Map<string, Set<string>>();
  for (const a of allAssignments) {
    if (!projectAssignments.has(a.projectId)) projectAssignments.set(a.projectId, new Set());
    projectAssignments.get(a.projectId)!.add(a.memberId);
  }

  // Filter: if project has no assignments, all org members can access; if it has assignments, only assigned members
  const accessible = allProjects.filter((p) => {
    const assigned = projectAssignments.get(p.id);
    if (!assigned || assigned.size === 0) return true; // no assignments = open to all org members
    return assigned.has(mem.id); // has assignments = only assigned members
  });

  return accessible;
}


