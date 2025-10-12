"use server";

import { db } from "@/db/drizzle";
import { auditLog, member } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function logAudit(request: Request, params: {
  action: string;
  targetType: string;
  targetId?: string | null;
  meta?: Record<string, unknown> | null;
}) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return;
    const mem = await db.query.member.findFirst({ where: eq(member.userId, session.user.id) });
    if (!mem) return;
    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      orgId: mem.organizationId,
      actorId: session.user.id,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId ?? null,
      meta: params.meta ? JSON.stringify(params.meta) : null,
      createdAt: new Date(),
    });
  } catch (e) {
    // swallow
  }
}


