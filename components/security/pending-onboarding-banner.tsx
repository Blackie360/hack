"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { getOrgKey } from "@/lib/crypto/storage";

export default function PendingOnboardingBanner() {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has org key
    const hasKey = !!getOrgKey();
    setNeedsOnboarding(!hasKey);
  }, []);

  if (!needsOnboarding) return null;

  return (
    <Card className="border-yellow-600 bg-yellow-950/20">
      <CardContent className="flex items-start gap-3 p-4">
        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-yellow-600">Pending Access</p>
          <p className="text-sm text-muted-foreground">
            You don't have access to the organization encryption key yet. 
            Please ask the organization owner to onboard you via <strong>Settings → Onboard Members</strong>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

