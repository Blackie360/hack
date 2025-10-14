"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Building2 } from "lucide-react";
import { toast } from "sonner";

interface InvitationAcceptanceProps {
  invitation: {
    id: string;
    email: string;
    role: string;
    organizationName: string;
    organizationLogo: string | null;
    inviterName: string;
    inviterEmail: string;
    expiresAt: string;
  };
  isLoggedIn: boolean;
  emailMatches: boolean;
}

export function InvitationAcceptance({
  invitation,
  isLoggedIn,
  emailMatches,
}: InvitationAcceptanceProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleAccept = async () => {
    try {
      setIsAccepting(true);

      // If user is logged in with matching email, accept directly
      if (isLoggedIn && emailMatches) {
        const response = await fetch(`/api/accept-invitation/${invitation.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to accept invitation");
        }

        toast.success("Invitation accepted! Redirecting...");
        
        // Get organization info to redirect properly
        const orgResponse = await fetch(`/api/organization/${data.organizationId}`);
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          setTimeout(() => {
            router.push(`/dashboard/organization/${orgData.slug}`);
            router.refresh();
          }, 1000);
        } else {
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1000);
        }
      } else {
        // Redirect to login/signup page
        router.push(`/auth?redirect=/invitation/${invitation.id}`);
      }
    } catch (error) {
      console.error("Accept error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to accept invitation");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);

      const response = await fetch(`/api/reject-invitation/${invitation.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject invitation");
      }

      toast.success("Invitation rejected");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Reject error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reject invitation");
    } finally {
      setIsRejecting(false);
    }
  };

  const expiresAt = new Date(invitation.expiresAt);
  const hoursUntilExpiry = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60));

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {invitation.organizationLogo ? (
              <img
                src={invitation.organizationLogo}
                alt={invitation.organizationName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary-foreground" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            You&apos;ve Been Invited!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            <span className="font-semibold">
              {invitation.inviterName}
            </span>{" "}
            invited you to join{" "}
            <span className="font-semibold">
              {invitation.organizationName}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Simple details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Email:</span> {invitation.email}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Role:</span> {invitation.role}
            </p>
            {hoursUntilExpiry > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Expires in:</span> {hoursUntilExpiry} hours
              </p>
            )}
          </div>

          {/* Simple Accept/Reject buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAccept}
              disabled={isAccepting || isRejecting}
              className="flex-1 h-12 text-base"
            >
              {isAccepting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Accept
                </>
              )}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isAccepting || isRejecting}
              variant="outline"
              className="flex-1 h-12 text-base"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-5 w-5" />
                  Reject
                </>
              )}
            </Button>
          </div>

          {/* Show message if user is logged in with wrong email */}
          {isLoggedIn && !emailMatches && (
            <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-destructive">
                You&apos;re logged in with a different email. Please log out and sign in with{" "}
                <span className="font-semibold">{invitation.email}</span> to accept this invitation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

