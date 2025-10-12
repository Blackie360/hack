"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrgKey } from "@/lib/crypto/storage";
import { toast } from "sonner";

type Member = {
  id: string;
  email: string;
  role: string;
  hasWrappedKey: boolean;
};

type Props = {
  members: Member[];
  orgId: string;
};

export default function OnboardMembers({ members, orgId }: Props) {
  const [loading, setLoading] = useState(false);

  const membersNeedingOnboarding = members.filter(m => !m.hasWrappedKey && m.role !== "owner");

  async function handleOnboard() {
    const orgKey = getOrgKey();
    if (!orgKey) {
      toast.error("Please unlock your workspace first");
      return;
    }

    setLoading(true);
    try {
      // Convert org key to base64
      const orgKeyB64 = btoa(String.fromCharCode(...orgKey));
      
      const res = await fetch("/api/rewrap-member-keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          orgKeyB64,
          targetMemberIds: membersNeedingOnboarding.map(m => m.id)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to onboard members");

      const successful = data.results.filter((r: any) => r.success).length;
      const failed = data.results.filter((r: any) => !r.success).length;

      if (successful > 0) {
        toast.success(`Successfully onboarded ${successful} member(s)`);
      }
      if (failed > 0) {
        toast.error(`Failed to onboard ${failed} member(s)`);
      }

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error("Onboard error:", error);
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  }

  if (membersNeedingOnboarding.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboard Members</CardTitle>
        <CardDescription>
          The following members need access to the organization encryption key.
          Click below to securely share it with them.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {membersNeedingOnboarding.map(m => (
            <div key={m.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium">{m.email}</div>
                <div className="text-sm text-muted-foreground capitalize">{m.role}</div>
              </div>
              <div className="text-xs text-yellow-600">Pending onboarding</div>
            </div>
          ))}
        </div>
        <Button onClick={handleOnboard} loading={loading} className="w-full">
          Onboard {membersNeedingOnboarding.length} Member(s)
        </Button>
      </CardContent>
    </Card>
  );
}

