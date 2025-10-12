"use server";

import { db } from "@/db/drizzle";
import { environment } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function ensureDefaultEnvironments(projectId: string) {
  const existing = await db.query.environment.findMany({ where: eq(environment.projectId, projectId) });
  if (existing.length >= 3) return existing;
  const names = [
    { name: "Development", slug: "dev" },
    { name: "Staging", slug: "staging" },
    { name: "Production", slug: "prod" },
  ];
  const toCreate = names.filter(n => !existing.some(e => e.slug === n.slug));
  if (toCreate.length) {
    await Promise.all(toCreate.map(n => db.insert(environment).values({ id: crypto.randomUUID(), projectId, name: n.name, slug: n.slug, createdAt: new Date() })));
  }
  return await db.query.environment.findMany({ where: eq(environment.projectId, projectId) });
}


