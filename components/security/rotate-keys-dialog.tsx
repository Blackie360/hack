"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function RotateKeysDialog() {
  const [open, setOpen] = useState(false);
  const [owners, setOwners] = useState(1);
  const [admins, setAdmins] = useState(1);
  const [busy, setBusy] = useState(false);

  async function startRotation() {
    setBusy(true);
    try {
      const res = await fetch('/api/rotation', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ requiredApprovals: { owners, admins } })
      });
      await res.json();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Rotate Keys</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rotate Organization Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">Set quorum thresholds. Rotation proceeds when approvals are met, re-encrypting secrets progressively in the background.</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Owners required</label>
                <Input type="number" value={owners} onChange={e => setOwners(parseInt(e.target.value||'1'))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Admins required</label>
                <Input type="number" value={admins} onChange={e => setAdmins(parseInt(e.target.value||'1'))} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={startRotation} disabled={busy}>Start</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


