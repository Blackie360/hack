import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { secret } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const environmentId = searchParams.get("environmentId");
  if (!projectId || !environmentId) {
    return NextResponse.json({ error: "Missing projectId or environmentId" }, { status: 400 });
  }
  const list = await db.query.secret.findMany({
    where: (row, { eq, and }) => and(eq(row.projectId, projectId), eq(row.environmentId, environmentId)),
    columns: {
      id: true,
      name: true,
      ciphertext: true,
      nonce: true,
      aad: true,
      version: true,
      expiresAt: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ secrets: list });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { projectId, environmentId, name, ciphertext, nonce, aad, version, expiresAt } = body ?? {};
  if (!projectId || !environmentId || !name || !ciphertext || !nonce || !version) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  await db.insert(secret).values({
    id: crypto.randomUUID(),
    projectId,
    environmentId,
    name,
    ciphertext,
    nonce,
    aad: aad ?? null,
    version,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    createdBy: session.user.id,
    createdAt: new Date(),
  });
  return NextResponse.json({ ok: true });
}
