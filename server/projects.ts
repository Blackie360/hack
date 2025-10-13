"use server";

import { db } from "@/db/drizzle";
import { member, project } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export async function getAccessibleProjects(orgId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const mem = await db.query.member.findFirst({
    where: and(eq(member.userId, session.user.id), eq(member.organizationId, orgId)),
  });
  if (!mem) return [];

  // All org members can access all projects
  return await db.query.project.findMany({ where: eq(project.orgId, orgId) });
}


