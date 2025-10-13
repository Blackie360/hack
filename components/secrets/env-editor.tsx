"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Copy, Check, Upload } from "lucide-react";
import { toast } from "sonner";
import { encryptAesGcm } from "@/lib/crypto/secret";
import { getOrgKey } from "@/lib/crypto/org-key-manager";

type Row = { id: string; name: string; value: string; masked?: boolean; justCopied?: boolean };

export default function EnvEditor({ projectId, environmentId, onSaved }: { projectId: string; environmentId: string; onSaved?: () => void }) {
  const [rows, setRows] = useState<Row[]>([{ id: crypto.randomUUID(), name: "", value: "", masked: true }]);
  const [saving, setSaving] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  function addRow() {
    setRows((r) => [...r, { id: crypto.randomUUID(), name: "", value: "", masked: true }]);
  }
  function updateRow(id: string, key: keyof Row, v: string) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [key]: v } : x)));
  }
  function removeRow(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
  }

  function toggleMask(id: string) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, masked: !x.masked } : x)));
  }

  async function copyValue(id: string) {
    const row = rows.find((x) => x.id === id);
    if (!row) return;
    try {
      await navigator.clipboard.writeText(row.value);
      setRows((r) => r.map((x) => (x.id === id ? { ...x, justCopied: true } : x)));
      setTimeout(() => setRows((r) => r.map((x) => (x.id === id ? { ...x, justCopied: false } : x))), 1200);
    } catch {}
  }

  function parseDotEnv(text: string) {
    const out: Row[] = [];
    text.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const idx = trimmed.indexOf("=");
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, "");
      if (key) out.push({ id: crypto.randomUUID(), name: key, value: val, masked: true });
    });
    if (out.length) setRows(out);
  }

  async function saveAll() {
    const ok = getOrgKey();
    if (!ok) {
      toast.error("Encryption key not available. Please refresh the page.");
      return;
    }
    setSaving(true);
    const validRows = rows.filter((r) => r.name && r.value);
    if (validRows.length === 0) {
      toast.error("No valid secrets to save");
      setSaving(false);
      return;
    }
    try {
      // Parallel saves for speed
      const results = await Promise.allSettled(
        validRows.map(async (row) => {
          const aad = new TextEncoder().encode(`${projectId}:${environmentId}:${row.name}:v1`);
          const { ciphertext, iv } = await encryptAesGcm(ok, new TextEncoder().encode(row.value), aad);
          const resp = await fetch("/api/secrets", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              projectId,
              environmentId,
              name: row.name,
              ciphertext: btoa(String.fromCharCode(...ciphertext)),
              nonce: btoa(String.fromCharCode(...iv)),
              aad: btoa(String.fromCharCode(...aad)),
              version: "v1",
            }),
          });
          if (!resp.ok) {
            const contentType = resp.headers.get("content-type");
            let errorMsg = `${resp.status}`;
            if (contentType?.includes("application/json")) {
              const data = await resp.json();
              errorMsg = data.error || errorMsg;
            } else {
              errorMsg = await resp.text() || errorMsg;
            }
            throw new Error(errorMsg);
          }
          return row.name;
        })
      );
      const success = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;
      const errors = results
        .filter((r) => r.status === "rejected")
        .map((r) => (r as PromiseRejectedResult).reason?.message ?? "Unknown error");

      if (success) toast.success(`Saved ${success} secret${success > 1 ? "s" : ""}`);
      if (failed) {
        console.error("Failed secrets:", errors);
        toast.error(`${failed} secret${failed > 1 ? "s" : ""} failed. Check console and project access.`);
      }
      if (success) {
        if (onSaved) onSaved();
        else if (typeof window !== "undefined") window.location.reload();
      }
    } catch (e) {
      console.error("Save error:", e);
      toast.error("Failed to save secrets. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Environment Variables</div>
        <div className="flex gap-2">
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Upload className="mr-2 h-4 w-4" />Import .env</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Paste .env content</DialogTitle>
              </DialogHeader>
              <Textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="KEY=value" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
                <Button onClick={() => { parseDotEnv(importText); setImportOpen(false); }}>Apply</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={addRow}>Add Row</Button>
          <Button onClick={saveAll} loading={saving} loadingText="Saving..." disabled={saving || !rows.some(r => r.name && r.value)}>Save</Button>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <Input className="md:col-span-4" placeholder="NAME" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)} />
            <div className="md:col-span-7 flex gap-2">
              <Input type={row.masked ? 'password' : 'text'} className="flex-1" placeholder="Value" value={row.value} onChange={(e) => updateRow(row.id, 'value', e.target.value)} />
              <Button variant="outline" size="sm" onClick={() => toggleMask(row.id)}>{row.masked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</Button>
              <Button variant="outline" size="sm" onClick={() => copyValue(row.id)}>{row.justCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
            </div>
            <Button variant="outline" className="md:col-span-1" onClick={() => removeRow(row.id)}>Remove</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}


