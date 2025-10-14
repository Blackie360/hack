"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getOrgKey } from "@/lib/crypto/org-key-manager";
import { deriveKek } from "@/lib/crypto/argon2";
import { encryptAesGcm } from "@/lib/crypto/secret";
import RotateKeysDialog from "@/components/security/rotate-keys-dialog";

export default function SettingsPage() {
  const [hasRecovery, setHasRecovery] = useState<boolean>(false);
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      // Fetch recovery status
      const res = await fetch('/api/org-recovery');
      const data = await res.json();
      setHasRecovery(!!data?.recovery);
    })();
  }, []);

  async function setupRecovery() {
    const ok = getOrgKey();
    if (!ok || !pass) return;
    setBusy(true);
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const params = { timeCost: 3, memoryCost: 64 * 1024, parallelism: 1, saltB64: btoa(String.fromCharCode(...salt)) };
      const kek = await deriveKek(pass, params);
      const { ciphertext, iv } = await encryptAesGcm(kek, ok);
      const wrappedKeyByKEK = btoa(String.fromCharCode(...new Uint8Array([...ciphertext, ...iv])));
      await fetch('/api/org-recovery', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ wrappedKeyByKEK, params: JSON.stringify(params) })
      });
      setHasRecovery(true);
      setPass("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Organization Settings</h2>
        <p className="text-sm text-muted-foreground">
          Encryption keys are automatically managed based on your authentication session.
        </p>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Recovery Passphrase</h2>
        {hasRecovery ? (
          <p className="text-sm text-muted-foreground">Recovery is configured for this organization.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Set a recovery passphrase as an additional backup for your organization encryption key.</p>
            <Input type="password" placeholder="Enter a strong passphrase" value={pass} onChange={e => setPass(e.target.value)} />
            <Button onClick={setupRecovery} disabled={!pass || busy}>Set Recovery</Button>
          </div>
        )}
      </Card>
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Key Rotation</h2>
            <p className="text-sm text-muted-foreground">Start a progressive background rotation protected by quorum approvals.</p>
          </div>
          <RotateKeysDialog />
        </div>
      </Card>
    </div>
  );
}


