import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function InvitationNotFound() {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="max-w-md w-full">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">
            Invitation Not Found
          </h1>
          <p className="text-muted-foreground">
            The invitation you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button className="w-full">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

