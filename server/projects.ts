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

  if (mem.role === "owner") {
    return await db.query.project.findMany({ where: eq(project.orgId, orgId) });
  }

  // Use a plain select to avoid lateral joins that can fail under some drivers
  let pms: Array<{ projectId: string }> = [];
  try {
    pms = await db
      .select({ projectId: projectMember.projectId })
      .from(projectMember)
      .where(eq(projectMember.memberId, mem.id));
  } catch (e) {
    // If RLS blocks, return empty instead of throwing
    return [];
  }
  if (pms.length === 0) return [];
  const projIds = pms.map((p) => p.projectId);
  const projs = await db.query.project.findMany({ where: inArray(project.id, projIds) });
  return projs;
}


