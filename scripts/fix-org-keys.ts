import { db } from "@/db/drizzle";
import { orgKeyWrap } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

async function fixOrgKeys() {
  console.log("🔧 Fixing duplicate org keys...\n");
  
  try {
    // Get all wrapped keys
    const allKeys = await db.select().from(orgKeyWrap);
    console.log(`Found ${allKeys.length} total wrapped key(s)\n`);
    
    // Group by org
    const byOrg = new Map<string, typeof allKeys>();
    for (const key of allKeys) {
      if (!byOrg.has(key.orgId)) byOrg.set(key.orgId, []);
      byOrg.get(key.orgId)!.push(key);
    }
    
    // For each org with duplicates, keep only the OLDEST one
    for (const [orgId, keys] of byOrg) {
      if (keys.length <= 1) {
        console.log(`✅ Org ${orgId}: Only 1 key, no action needed`);
        continue;
      }
      
      // Sort by created date (oldest first)
      const sorted = keys.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      const keepKey = sorted[0];
      const deleteKeys = sorted.slice(1);
      
      console.log(`🔍 Org ${orgId}:`);
      console.log(`   Keeping OLDEST key (Member: ${keepKey.memberId}, Created: ${keepKey.createdAt})`);
      console.log(`   Deleting ${deleteKeys.length} newer key(s):`);
      
      for (const delKey of deleteKeys) {
        console.log(`     - Member: ${delKey.memberId}, Created: ${delKey.createdAt}`);
        await db.delete(orgKeyWrap).where(
          and(
            eq(orgKeyWrap.id, delKey.id)
          )
        );
      }
      
      console.log(`   ✅ Cleaned up!\n`);
    }
    
    console.log("\n✅ Done! Refresh your browser and try decrypting again.");
    console.log("   The app will now use the original encryption key.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixOrgKeys();

