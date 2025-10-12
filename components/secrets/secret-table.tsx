"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import SecretEditor from "./secret-editor";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrgKey } from "@/lib/crypto/storage";
import { decryptAesGcm, encryptAesGcm } from "@/lib/crypto/secret";
import { toast } from "sonner";
import { Eye, Pencil, Trash2 } from "lucide-react";

type SecretRow = {
  id: string;
  name: string;
  ciphertext: string;
  nonce: string;
  aad: string | null;
  version: string;
  expiresAt: string | null;
  createdAt: string;
};

export default function SecretTable({ projectId, environmentId, userRole }: { projectId: string; environmentId: string; userRole?: string }) {
  const [rows, setRows] = useState<SecretRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewSecret, setViewSecret] = useState<{ name: string; value: string; created: string } | null>(null);
  const [editSecret, setEditSecret] = useState<{ id: string; name: string; value: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const unlocked = useMemo(() => !!getOrgKey(), []);
  const canWrite = userRole === "owner" || userRole === "admin";

  useEffect(() => {
    loadSecrets();
  }, [projectId, environmentId]);

  async function loadSecrets() {
    const url = `/api/secrets?projectId=${encodeURIComponent(projectId)}&environmentId=${encodeURIComponent(environmentId)}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    setRows(data.secrets ?? []);
    setSelected(new Set());
  }

  async function handleView(row: SecretRow) {
    const ok = getOrgKey();
    if (!ok) { toast.error("Unlock workspace first"); return; }
    try {
      const ct = Uint8Array.from(atob(row.ciphertext), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(row.nonce), c => c.charCodeAt(0));
      const aad = row.aad ? Uint8Array.from(atob(row.aad), c => c.charCodeAt(0)) : undefined;
      const plaintext = await decryptAesGcm(ok, ct, iv, aad);
      setViewSecret({ name: row.name, value: new TextDecoder().decode(plaintext), created: new Date(row.createdAt).toLocaleString() });
    } catch (e) {
      toast.error("Failed to decrypt secret");
    }
  }

  async function handleEdit(row: SecretRow) {
    const ok = getOrgKey();
    if (!ok) { toast.error("Unlock workspace first"); return; }
    try {
      const ct = Uint8Array.from(atob(row.ciphertext), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(row.nonce), c => c.charCodeAt(0));
      const aad = row.aad ? Uint8Array.from(atob(row.aad), c => c.charCodeAt(0)) : undefined;
      const plaintext = await decryptAesGcm(ok, ct, iv, aad);
      setEditSecret({ id: row.id, name: row.name, value: new TextDecoder().decode(plaintext) });
    } catch (e) {
      toast.error("Failed to decrypt secret");
    }
  }

  async function saveEdit() {
    if (!editSecret) return;
    const ok = getOrgKey();
    if (!ok) { toast.error("Unlock workspace first"); return; }
    setLoading(true);
    try {
      const aad = new TextEncoder().encode(`${projectId}:${environmentId}:${editSecret.name}:v1`);
      const { ciphertext, iv } = await encryptAesGcm(ok, new TextEncoder().encode(editSecret.value), aad);
      const resp = await fetch(`/api/secrets/${editSecret.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ciphertext: btoa(String.fromCharCode(...ciphertext)),
          nonce: btoa(String.fromCharCode(...iv)),
          aad: btoa(String.fromCharCode(...aad)),
        }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      toast.success("Secret updated");
      setEditSecret(null);
      loadSecrets();
    } catch (e) {
      toast.error("Failed to update secret");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(ids: string[]) {
    if (ids.length === 0) return;
    setDeleteConfirm(ids);
  }

  async function confirmDelete() {
    if (deleteConfirm.length === 0) return;
    setLoading(true);
    try {
      const resp = await fetch("/api/secrets/bulk-delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: deleteConfirm }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      toast.success(`Deleted ${deleteConfirm.length} secret${deleteConfirm.length > 1 ? "s" : ""}`);
      setDeleteConfirm([]);
      loadSecrets();
    } catch (e) {
      toast.error("Failed to delete secrets");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function toggleSelectAll() {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  }

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Secrets</h3>
            {selected.size > 0 && canWrite && (
              <Button size="sm" variant="destructive" onClick={() => handleDelete(Array.from(selected))}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {selected.size}
              </Button>
            )}
          </div>
        </div>
        {rows.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon" />
              <EmptyTitle>No secrets yet</EmptyTitle>
              <EmptyDescription>Add your first secret or import a .env file.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {canWrite && (
                  <TableHead className="w-12">
                    <Checkbox checked={selected.size === rows.length} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                )}
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  {canWrite && (
                    <TableCell>
                      <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                    </TableCell>
                  )}
                  <TableCell className="font-mono text-sm">{r.name}</TableCell>
                  <TableCell>{r.version}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleView(r)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canWrite && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(r)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete([r.id])}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!unlocked && (
          <div className="text-xs text-muted-foreground mt-2">Unlock to decrypt values client‑side.</div>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewSecret} onOpenChange={() => setViewSecret(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewSecret?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium mb-1">Value</div>
              <Textarea value={viewSecret?.value} readOnly rows={6} className="font-mono text-sm" />
            </div>
            <div className="text-xs text-muted-foreground">Created: {viewSecret?.created}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewSecret(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editSecret} onOpenChange={() => setEditSecret(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Secret: {editSecret?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium mb-1">Value</div>
              <Textarea
                value={editSecret?.value}
                onChange={(e) => setEditSecret((s) => (s ? { ...s, value: e.target.value } : null))}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSecret(null)}>Cancel</Button>
            <Button onClick={saveEdit} loading={loading} loadingText="Saving...">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirm.length > 0} onOpenChange={() => setDeleteConfirm([])}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteConfirm.length} secret{deleteConfirm.length > 1 ? "s" : ""}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The selected secrets will be permanently deleted.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm([])}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} loading={loading} loadingText="Deleting...">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}