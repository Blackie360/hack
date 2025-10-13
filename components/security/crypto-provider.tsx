"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { initOrgKeyFromSession, clearOrgKey } from "@/lib/crypto/org-key-manager";

export default function CryptoProvider({ 
  children,
  orgId 
}: { 
  children: React.ReactNode;
  orgId: string;
}) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initCrypto() {
      try {
        console.log("[CryptoProvider] Initializing crypto for orgId:", orgId);
        
        // Get the current session - try different access patterns
        const sessionData = await authClient.getSession();
        console.log("[CryptoProvider] Session data structure:", {
          hasData: !!sessionData?.data,
          hasUser: !!sessionData?.data?.user,
          hasSession: !!sessionData?.session,
          sessionKeys: sessionData ? Object.keys(sessionData) : []
        });
        
        // Handle different possible session structures
        let userId: string | undefined;
        
        if (sessionData?.data?.user?.id) {
          userId = sessionData.data.user.id;
        } else if (sessionData?.user?.id) {
          userId = sessionData.user.id;
        } else if ((sessionData as any)?.session?.userId) {
          userId = (sessionData as any).session.userId;
        }
        
        console.log("[CryptoProvider] Extracted userId:", userId);
        
        if (userId && orgId) {
          await initOrgKeyFromSession(userId, orgId);
          console.log("[CryptoProvider] ✅ Crypto initialized successfully");
        } else {
          const errorMsg = `Missing ${!userId ? 'userId' : 'orgId'}`;
          console.error("[CryptoProvider] ❌", errorMsg);
          setError(errorMsg);
        }
        
        setInitialized(true);
      } catch (e) {
        console.error("[CryptoProvider] ❌ Error during initialization:", e);
        setError(e instanceof Error ? e.message : "Unknown error");
        setInitialized(true);
      }
    }

    initCrypto();

    // Cleanup on unmount
    return () => {
      clearOrgKey();
    };
  }, [orgId]);

  // Show nothing while initializing to prevent flash
  if (!initialized) {
    return null;
  }

  // Show error in development
  if (error && process.env.NODE_ENV === 'development') {
    console.warn("[CryptoProvider] Initialized with error:", error);
  }

  return <>{children}</>;
}

