"use client";

import { useEffect, useState } from "react";
import UnlockModal from "@/components/security/unlock-modal";
import { getOrgKey } from "@/lib/crypto/storage";

export default function UnlockGate({ children }: { children: React.ReactNode }) {
  const [wrapped, setWrapped] = useState<{ payloadB64: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function run() {
      try {
        if (getOrgKey()) return; // already unlocked
        const res = await fetch("/api/org-keys", { cache: "no-store" });
        const data = await res.json();
        if (data?.wrapped) {
          setWrapped(data.wrapped);
          setOpen(true);
        }
      } catch (e) {
        // ignore
      }
    }
    run();
  }, []);

  return (
    <>
      {children}
      {wrapped ? (
        <UnlockModal
          isOpen={open}
          onUnlocked={() => setOpen(false)}
          wrappedOrgKeyForMember={wrapped}
        />
      ) : null}
    </>
  );
}


