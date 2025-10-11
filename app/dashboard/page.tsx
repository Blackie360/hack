import UnlockGate from "@/components/security/unlock-gate";

export default function DashboardHome() {
  return (
    <UnlockGate>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Select an organization to manage your secrets.</p>
      </div>
    </UnlockGate>
  );
}

import { CreateOrganizationForm } from "@/components/forms/create-organization-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getOrganizations } from "@/server/organizations";
import Link from "next/link";

export default async function Dashboard() {
  const organizations = await getOrganizations();

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Create Organization</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to get started.
            </DialogDescription>
          </DialogHeader>
          <CreateOrganizationForm />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Organizations</h2>
        {organizations.map((organization) => (
          <Button variant="outline" key={organization.id} asChild>
            <Link href={`/dashboard/organization/${organization.slug}`}>
              {organization.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
