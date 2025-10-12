"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { setOrgKey, getDeviceKeypair, getOrCreateDeviceKeypair } from "@/lib/crypto/storage";
import { sealedBoxDecrypt, sealedBoxEncrypt } from "@/lib/crypto/box";

type Props = {
  isOpen: boolean;
  onUnlocked: () => void;
  wrappedOrgKeyForMember?: { payloadB64: string } | null;
  memberCtx?: { memberId: string; orgId: string } | null;
};

export default function UnlockModal({ isOpen, onUnlocked, wrappedOrgKeyForMember, memberCtx }: Props) {
  const [error, setError] = useState<string | null>(null);
  const device = useMemo(() => getDeviceKeypair() ?? getOrCreateDeviceKeypair(), []);

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  async function attemptUnlock() {
    try {
      if (!device) throw new Error("Missing device keys");
      if (wrappedOrgKeyForMember) {
        const key = sealedBoxDecrypt(device.secretKeyB64, wrappedOrgKeyForMember.payloadB64);
        if (!key) throw new Error("Failed to decrypt org key");
        setOrgKey(key);
        onUnlocked();
        return;
      }
      if (memberCtx) {
        // Bootstrap new org key for member
        const orgKey = crypto.getRandomValues(new Uint8Array(32));
        const { payloadB64 } = sealedBoxEncrypt(device.publicKeyB64, orgKey);
        await fetch("/api/org-keys", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orgId: memberCtx.orgId, memberId: memberCtx.memberId, wrappedKey: payloadB64 })
        });
        setOrgKey(orgKey);
        onUnlocked();
        return;
      }
      throw new Error("No wrapped key or member context");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock workspace</DialogTitle>
          <DialogDescription>
            We need to decrypt your organization key locally. This keeps your secrets end‑to‑end encrypted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Your device keypair will be generated and stored locally if not present.
          </div>
          {error ? <div className="text-sm text-red-500">{error}</div> : null}
          <div className="flex justify-end">
            <Button onClick={attemptUnlock}>Unlock</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


