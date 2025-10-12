"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getOrgKey } from "@/lib/crypto/storage";
import { encryptAesGcm } from "@/lib/crypto/secret";

export default function SecretEditor({ projectId, environmentId, onSaved }: { projectId: string; environmentId: string; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    const ok = getOrgKey();
    if (!ok) return;
    setSaving(true);
    try {
      const aad = new TextEncoder().encode(`${projectId}:${environmentId}:${name}:v1`);
      const { ciphertext, iv } = await encryptAesGcm(ok, new TextEncoder().encode(value), aad);
      await fetch("/api/secrets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          projectId,
          environmentId,
          name,
          ciphertext: btoa(String.fromCharCode(...ciphertext)),
          nonce: btoa(String.fromCharCode(...iv)),
          aad: btoa(String.fromCharCode(...aad)),
          version: "v1",
        })
      });
      setOpen(false);
      setName("");
      setValue("");
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} disabled={saving}>{saving ? "Saving..." : "New Secret"}</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Secret</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name (e.g. DATABASE_URL)" value={name} onChange={e => setName(e.target.value)} />
            <Textarea placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={save} disabled={saving || !name || !value}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


