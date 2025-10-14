"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const inviteFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["member", "admin"]),
});

interface InviteMemberFormProps {
  organizationId: string;
}

export function InviteMemberForm({ organizationId }: InviteMemberFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  async function onSubmit(values: z.infer<typeof inviteFormSchema>) {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/invite-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          role: values.role,
          organizationId: organizationId,
        }),
      });

      let data: { error?: string; message?: string } | null = null;
      try {
        const ct = response.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = { error: text };
        }
      } catch {
        data = {};
      }

      if (!response.ok) {
        console.error('Invitation error:', data);
        const msg = (data && (data.error || data.message)) || `Failed to send invitation (${response.status})`;
        toast.error(msg);
        return;
      }

      toast.success(`Invitation sent to ${values.email}`);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error('Invitation error:', error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 md:p-6 bg-card">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <UserPlus className="h-5 w-5" />
        <h3 className="text-base md:text-lg font-semibold">Invite New Member</h3>
      </div>
      
      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
        Send an invitation to join your organization. They&apos;ll receive an email with a link to accept.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="colleague@company.com" 
                    type="email"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Invitation...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
