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
          // Auto-unlock silently (don't show modal)
          await autoUnlock(data.wrapped, data.member);
        }
      } catch (e) {
        // ignore
      }
    }
    run();
  }, []);

  async function autoUnlock(wrappedKey: { payloadB64: string } | null, memberContext: { memberId: string; orgId: string } | null) {
    const { getOrCreateDeviceKeypair } = await import("@/lib/crypto/storage");
    const { sealedBoxDecrypt, sealedBoxEncrypt } = await import("@/lib/crypto/box");
    const { setOrgKey } = await import("@/lib/crypto/storage");
    
    try {
      const device = getOrCreateDeviceKeypair();
      if (!device) {
        console.log("No device keys, showing manual unlock");
        setOpen(true);
        return;
      }

      // Try to decrypt existing wrapped key
      if (wrappedKey) {
        const key = sealedBoxDecrypt(device.secretKeyB64, wrappedKey.payloadB64);
        if (key) {
          setOrgKey(key);
          console.log("✅ Auto-unlocked successfully (org key length:", key.length, ")");
          return; // success
        } else {
          console.error("Failed to decrypt wrapped key with device key");
          setOpen(true);
          return;
        }
      }

      // If member doesn't have wrapped key
      if (memberContext && !wrappedKey) {
        console.log("⚠️ Member has no wrapped key");
        
        // Check if owner has wrapped key
        const ownerRes = await fetch(`/api/org-keys?fetchOwnerKey=true&orgId=${memberContext.orgId}`, { cache: "no-store" });
        const ownerData = await ownerRes.json();
        
        if (ownerData?.ownerWrappedKey) {
          // Owner has org key → member needs to be onboarded by owner
          console.log("⚠️ Owner has org key. Member needs onboarding via Settings page.");
          console.log("💡 Owner should visit Settings → Onboard Members");
          // Don't show unlock modal - just silently fail and let member know via UI
          return;
        }

        // No one has org key yet → bootstrap new one (owner scenario)
        console.log("🔑 Bootstrapping new org key (first member)");
        const orgKey = crypto.getRandomValues(new Uint8Array(32));
        const { payloadB64 } = sealedBoxEncrypt(device.publicKeyB64, orgKey);
        await fetch("/api/org-keys", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orgId: memberContext.orgId, memberId: memberContext.memberId, wrappedKey: payloadB64 })
        });
        setOrgKey(orgKey);
        console.log("✅ Created new org key successfully");
        return;
      }

      // If we reach here, something went wrong
      console.error("Unexpected unlock state");
      setOpen(true);
    } catch (e) {
      console.error("Auto-unlock failed:", e);
      setOpen(true);
    }
  }

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


