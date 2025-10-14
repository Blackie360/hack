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

  useEffect(() => {
    async function initCrypto() {
      try {
        // Get the current session - try different access patterns
        const sessionData = await authClient.getSession();
        
        // Handle different possible session structures
        let userId: string | undefined;
        
        // Check if data.user.id exists
        if (sessionData?.data && typeof sessionData.data === 'object' && sessionData.data !== null && 'user' in sessionData.data) {
          const userData = sessionData.data as { user?: { id: string } };
          if (userData.user?.id) {
            userId = userData.user.id;
          }
        }
        
        if (userId && orgId) {
          await initOrgKeyFromSession(userId, orgId);
        }
        
        setInitialized(true);
      } catch {
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

  return <>{children}</>;
}

