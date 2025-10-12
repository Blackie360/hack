import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { auditLog, member } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const mem = await db.query.member.findFirst({ where: eq(member.userId, session.user.id) });
  if (!mem) return NextResponse.json({ logs: [] });
  const rows = await db.select().from(auditLog)
    .where(eq(auditLog.orgId, mem.organizationId))
    .orderBy(desc(auditLog.createdAt))
    .limit(100);
  return NextResponse.json({ logs: rows });
}


