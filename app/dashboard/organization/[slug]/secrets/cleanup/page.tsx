"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { getOrgKey } from "@/lib/crypto/org-key-manager";
import { decryptAesGcm } from "@/lib/crypto/secret";
import { toast } from "sonner";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

type SecretStatus = {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  canDecrypt: boolean;
  error?: string;
};

export default function CleanupPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const environmentId = searchParams.get("env") || "dev";
  
  const [secrets, setSecrets] = useState<SecretStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (projectId) {
      checkSecrets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, environmentId]);

  async function checkSecrets() {
    setLoading(true);
    try {
      const url = `/api/secrets?projectId=${encodeURIComponent(projectId!)}&environmentId=${encodeURIComponent(environmentId)}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        toast.error("Failed to load secrets");
        return;
      }
      const data = await res.json();
      const secretRows = data.secrets || [];

      const ok = getOrgKey();
      if (!ok) {
        toast.error("Encryption key not available. Please refresh the page.");
        setLoading(false);
        return;
      }

      const statuses: SecretStatus[] = [];
      for (const row of secretRows) {
        let canDecrypt = false;
        let error = "";
        
        try {
          const ct = Uint8Array.from(atob(row.ciphertext), c => c.charCodeAt(0));
          const iv = Uint8Array.from(atob(row.nonce), c => c.charCodeAt(0));
          const aad = row.aad ? Uint8Array.from(atob(row.aad), c => c.charCodeAt(0)) : undefined;
          await decryptAesGcm(ok, iv, ct, aad);
          canDecrypt = true;
        } catch (err) {
          error = err instanceof Error ? err.message : "Decryption failed";
        }

        statuses.push({
          id: row.id,
          name: row.name,
          version: row.version,
          createdAt: row.createdAt,
          canDecrypt,
          error,
        });
      }

      setSecrets(statuses);
    } catch {
      toast.error("Failed to check secrets");
    } finally {
      setLoading(false);
    }
  }

  async function deleteFailedSecrets() {
    const failedIds = secrets.filter(s => !s.canDecrypt).map(s => s.id);
    if (failedIds.length === 0) {
      toast.info("No failed secrets to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${failedIds.length} secret(s) that cannot be decrypted? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      const resp = await fetch("/api/secrets/bulk-delete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: failedIds }),
      });
      
      if (!resp.ok) {
        throw new Error("Failed to delete");
      }
      
      toast.success(`Deleted ${failedIds.length} secret(s)`);
      checkSecrets(); // Refresh the list
    } catch {
      toast.error("Failed to delete secrets");
    } finally {
      setDeleting(false);
    }
  }

  const failedCount = secrets.filter(s => !s.canDecrypt).length;
  const successCount = secrets.filter(s => s.canDecrypt).length;

  if (!projectId) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card className="p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon" />
              <EmptyTitle>No Project Selected</EmptyTitle>
              <EmptyDescription>Please select a project from the secrets page.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Secret Cleanup Tool</h1>
        <p className="text-muted-foreground">
          Check which secrets can be decrypted with your current encryption key and clean up old secrets.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Secret Status</h2>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">
                ✓ Can decrypt: {successCount}
              </span>
              <span className="text-red-600">
                ✗ Cannot decrypt: {failedCount}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={checkSecrets} disabled={loading}>
              {loading ? "Checking..." : "Refresh"}
            </Button>
            {failedCount > 0 && (
              <Button variant="destructive" onClick={deleteFailedSecrets} disabled={deleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Failed ({failedCount})
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Checking secrets...</div>
        ) : secrets.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon" />
              <EmptyTitle>No Secrets Found</EmptyTitle>
              <EmptyDescription>There are no secrets in this project/environment.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {secrets.map((secret) => (
                <TableRow key={secret.id}>
                  <TableCell>
                    {secret.canDecrypt ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </TableCell>
                  <TableCell className="font-mono">{secret.name}</TableCell>
                  <TableCell>{secret.version}</TableCell>
                  <TableCell>{new Date(secret.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {secret.error || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-800">
        <h3 className="font-semibold mb-2">ℹ️ About This Tool</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            This page checks if your current encryption key can decrypt existing secrets. 
            Secrets that fail to decrypt were likely encrypted with a different key system.
          </p>
          <p>
            <strong>What causes this?</strong> If the encryption system was changed or if you&apos;re 
            accessing secrets from a different user/organization context, the keys won&apos;t match.
          </p>
          <p>
            <strong>Solution:</strong> Delete the old secrets that cannot be decrypted and recreate 
            them with the current encryption key. The &quot;Delete Failed&quot; button will remove all secrets 
            that fail decryption.
          </p>
        </div>
      </Card>
    </div>
  );
}

