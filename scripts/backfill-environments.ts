import { db } from "@/db/drizzle";
import { project } from "@/db/schema";
import { ensureDefaultEnvironments } from "@/server/environments";

async function backfillEnvironments() {
  console.log("🔄 Backfilling environments for existing projects...");
  
  try {
    const projects = await db.query.project.findMany();
    console.log(`Found ${projects.length} project(s)`);
    
    for (const proj of projects) {
      console.log(`  ⏳ Processing project: ${proj.name} (${proj.slug})`);
      const envs = await ensureDefaultEnvironments(proj.id);
      console.log(`    ✅ Ensured ${envs.length} environment(s): ${envs.map(e => e.slug).join(", ")}`);
    }
    
    console.log("✅ Backfill complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Backfill failed:", error);
    process.exit(1);
  }
}

backfillEnvironments();

