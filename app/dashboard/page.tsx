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
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const organizations = await getOrganizations();

  // If user has organizations, redirect to the first one
  if (organizations.length > 0) {
    redirect(`/dashboard/organization/${organizations[0].slug}`);
  }

  // Only show this page for new users with no organizations
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen px-4 py-20">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to LockIn</h1>
          <p className="text-muted-foreground">
            Get started by creating your first organization to manage secrets and collaborate with your team.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto">
              Create Your First Organization
            </Button>
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
      </div>
    </div>
  );
}
