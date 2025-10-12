"use server";

import { db } from "@/db/drizzle";
import { member, organization } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { getCurrentUser } from "./users";

export async function getOrganizations() {
    const { currentUser } = await getCurrentUser();

    const members = await db.query.member.findMany({
        where: eq(member.userId, currentUser.id),
    });

    const organizations = await db.query.organization.findMany({
        where: inArray(organization.id, members.map((member) => member.organizationId)),
    });

    return organizations;
}

export async function getActiveOrganization(userId: string) {
    const memberUser = await db.query.member.findFirst({
        where: eq(member.userId, userId),
    });

    if (!memberUser) {
        return null;
    }

    const activeOrganization = await db.query.organization.findFirst({
        where: eq(organization.id, memberUser.organizationId),
    });

    return activeOrganization;
}

export async function getOrganizationBySlug(slug: string) {
  try {
    const { currentUser } = await getCurrentUser();
    const myMemberships = await db.query.member.findMany({
      where: eq(member.userId, currentUser.id),
    });
    const orgIds = myMemberships.map((m) => m.organizationId);
    if (orgIds.length === 0) return null;

    const organizationBySlug = await db.query.organization.findFirst({
      where: and(eq(organization.slug, slug), inArray(organization.id, orgIds)),
      with: {
        members: {
          with: {
            user: true,
          },
        },
      },
    });

    return organizationBySlug;
  } catch (error) {
    console.error(error);
    return null;
  }
}