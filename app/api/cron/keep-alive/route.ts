import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 10; // Max 10 seconds for hobby plan

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Simple query to keep the database active
    const result = await db.execute(sql`SELECT NOW() as current_time, 1 as status`);
    
    const timestamp = new Date().toISOString();
    console.log("✅ Database ping successful at:", timestamp);
    
    return NextResponse.json({ 
      success: true, 
      message: "Database pinged successfully - Supabase kept alive",
      serverTime: result[0] || { current_time: timestamp, status: 1 },
      timestamp
    });
  } catch (error) {
    console.error("❌ Database ping failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to ping database",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

