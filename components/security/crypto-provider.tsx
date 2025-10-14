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
        
        if (sessionData?.data?.user?.id) {
          userId = sessionData.data.user.id;
        } else if (sessionData?.user?.id) {
          userId = sessionData.user.id;
        } else if (sessionData && typeof sessionData === 'object' && 'session' in sessionData && typeof sessionData.session === 'object' && sessionData.session && 'userId' in sessionData.session) {
          userId = sessionData.session.userId as string;
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

