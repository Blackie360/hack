import UnlockGate from "@/components/security/unlock-gate";
import SecretTable from "@/components/secrets/secret-table";

export default async function SecretsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // In v1, use placeholders or fetch the first project/env; UI for selectors comes later.
  const projectId = slug; // placeholder mapping
  const environmentId = "dev"; // placeholder

  return (
    <UnlockGate>
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Secrets</h1>
          <p className="text-sm text-muted-foreground">Project and environment selectors coming next.</p>
        </div>
        <SecretTable projectId={projectId} environmentId={environmentId} />
      </div>
    </UnlockGate>
  );
}


