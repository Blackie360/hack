import { db } from "@/db/drizzle";
import { orgKeyWrap, secret } from "@/db/schema";

async function checkOrgKeys() {
  console.log("🔍 Checking org keys and secrets...\n");
  
  try {
    // Check wrapped org keys
    const wrappedKeys = await db.select().from(orgKeyWrap);
    console.log(`Found ${wrappedKeys.length} wrapped org key(s):`);
    for (const wrap of wrappedKeys) {
      console.log(`  - Member: ${wrap.memberId}, Org: ${wrap.orgId}, Created: ${wrap.createdAt}`);
    }
    
    // Check secrets
    const secrets = await db.select().from(secret);
    console.log(`\nFound ${secrets.length} secret(s):`);
    for (const sec of secrets) {
      console.log(`  - ${sec.name} in project ${sec.projectId}, created: ${sec.createdAt}`);
    }
    
    // Check if there are multiple wrapped keys per org
    const orgCounts = new Map<string, number>();
    for (const wrap of wrappedKeys) {
      orgCounts.set(wrap.orgId, (orgCounts.get(wrap.orgId) || 0) + 1);
    }
    
    console.log("\n📊 Wrapped keys per org:");
    for (const [orgId, count] of orgCounts) {
      console.log(`  - Org ${orgId}: ${count} key(s)`);
      if (count > 1) {
        console.log(`    ⚠️  Multiple keys found! This can cause decryption issues.`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkOrgKeys();

