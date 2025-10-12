"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SecretEditor from "./secret-editor";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrgKey } from "@/lib/crypto/storage";

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

export default function SecretTable({ projectId, environmentId }: { projectId: string; environmentId: string }) {
  const [rows, setRows] = useState<SecretRow[]>([]);
  const unlocked = useMemo(() => !!getOrgKey(), []);

  useEffect(() => {
    async function load() {
      const url = `/api/secrets?projectId=${encodeURIComponent(projectId)}&environmentId=${encodeURIComponent(environmentId)}`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      setRows(data.secrets ?? []);
    }
    load();
  }, [projectId, environmentId]);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Secrets</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Import .env</Button>
          <SecretEditor projectId={projectId} environmentId={environmentId} onSaved={() => {
            // reload list
            (async () => {
              const url = `/api/secrets?projectId=${encodeURIComponent(projectId)}&environmentId=${encodeURIComponent(environmentId)}`;
              const res = await fetch(url, { cache: "no-store" });
              const data = await res.json();
              setRows(data.secrets ?? []);
            })();
          }} />
        </div>
      </div>
      {rows.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon" />
            <EmptyTitle>No secrets yet</EmptyTitle>
            <EmptyDescription>Add your first secret or import a .env file.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Import .env</Button>
              <SecretEditor projectId={projectId} environmentId={environmentId} onSaved={() => {
                (async () => {
                  const url = `/api/secrets?projectId=${encodeURIComponent(projectId)}&environmentId=${encodeURIComponent(environmentId)}`;
                  const res = await fetch(url, { cache: "no-store" });
                  const data = await res.json();
                  setRows(data.secrets ?? []);
                })();
              }} />
            </div>
          </EmptyContent>
        </Empty>
      ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.version}</TableCell>
              <TableCell>{r.expiresAt ? new Date(r.expiresAt).toLocaleString() : "—"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="destructive">Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
      {!unlocked ? (
        <div className="text-xs text-muted-foreground mt-2">Unlock to decrypt values client‑side.</div>
      ) : null}
    </Card>
  );
}


