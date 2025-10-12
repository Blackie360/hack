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

  const pms = await db.query.projectMember.findMany({ where: eq(projectMember.memberId, mem.id) });
  if (pms.length === 0) return [];
  const projIds = pms.map((p) => p.projectId);
  const projs = await db.query.project.findMany({ where: inArray(project.id, projIds) });
  return projs;
}


