"use server";

import { db } from "@/db/drizzle";
import { member } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

export type UserOrgContext = {
  userId: string;
  orgId: string | null;
  membership: typeof member.$inferSelect | null;
};

export async function getUserAndOrg(requiredOrgId?: string): Promise<UserOrgContext> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { userId: "", orgId: null, membership: null };

  const userId = session.user.id;
  const orgId = requiredOrgId ?? session.session.activeOrganizationId ?? null;

  if (!orgId) return { userId, orgId: null, membership: null };

  const membership = await db.query.member.findFirst({
    where: and(eq(member.userId, userId), eq(member.organizationId, orgId)),
  });

  return { userId, orgId, membership: membership ?? null };
}


