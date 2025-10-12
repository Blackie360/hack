import UnlockGate from "@/components/security/unlock-gate";
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
    <UnlockGate>
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen px-4 py-20">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">Create Organization</Button>
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

        <div className="flex flex-col gap-3 w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-bold text-center">Organizations</h2>
          {organizations.map((organization) => (
            <Button variant="outline" key={organization.id} asChild className="w-full">
              <Link href={`/dashboard/organization/${organization.slug}`}>
                {organization.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </UnlockGate>
  );
}
