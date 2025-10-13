"use client";

import { Icon } from "@iconify/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function UserNav({ name, email }: { name: string | null; email: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
            <span className="text-sm font-medium">
              {name?.charAt(0).toUpperCase() || email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{name || "User"}</span>
            <span className="truncate text-xs text-muted-foreground">{email}</span>
          </div>
          <Icon icon="mdi:logout" className="size-4 ml-auto cursor-pointer hover:text-destructive" onClick={handleLogout} />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

