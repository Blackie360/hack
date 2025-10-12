"use client";

import { useEffect, useState } from "react";
import UnlockModal from "@/components/security/unlock-modal";
import { getOrgKey } from "@/lib/crypto/storage";

export default function UnlockGate({ children }: { children: React.ReactNode }) {
  const [wrapped, setWrapped] = useState<{ payloadB64: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [memberCtx, setMemberCtx] = useState<{ memberId: string; orgId: string } | null>(null);

  useEffect(() => {
    async function run() {
      try {
        if (getOrgKey()) return; // already unlocked
        // register device public key
        try {
          const resp = await fetch("/api/member-device-keys", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ publicKeyB64: (JSON.parse(localStorage.getItem("vaultsync.device_keys")||"{}")?.publicKeyB64) })
          });
          await resp.json().catch(()=>null);
        } catch {}
        const res = await fetch("/api/org-keys", { cache: "no-store" });
        const data = await res.json();
        if (data?.wrapped || data?.member) {
          setWrapped(data.wrapped ?? null);
          setMemberCtx(data.member ?? null);
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
      {wrapped || memberCtx ? (
        <UnlockModal
          isOpen={open}
          onUnlocked={() => setOpen(false)}
          wrappedOrgKeyForMember={wrapped}
          memberCtx={memberCtx}
        />
      ) : null}
    </>
  );
}


