import Link from "next/link";
import { Button } from "@/components/ui/button";
import CommandMenu from "@/components/command-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function OrgLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-4rem)] gap-4 px-4 py-6">
        <Sidebar>
          <SidebarHeader>
            <div className="text-sm font-semibold">Organization</div>
          </SidebarHeader>
          <SidebarContent>
            <OrgSidebar params={params} />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="flex items-center justify-between">
            <CommandMenu />
          </div>
          <div className="mt-4">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

async function OrgNav({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = `/dashboard/organization/${slug}`;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" asChild><Link href={base}>Overview</Link></Button>
      <Button variant="outline" asChild><Link href={`${base}/secrets`}>Secrets</Link></Button>
      <Button variant="outline" asChild><Link href={`${base}/members`}>Members</Link></Button>
      <Button variant="outline" asChild><Link href={`${base}/invites`}>Invites</Link></Button>
      <Button variant="outline" asChild><Link href={`${base}/audit`}>Audit</Link></Button>
      <Button variant="outline" asChild><Link href={`${base}/settings`}>Settings</Link></Button>
    </div>
  );
}

async function OrgSidebar({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = `/dashboard/organization/${slug}`;
  return (
    <SidebarMenu>
      <SidebarGroup>
        <SidebarGroupLabel>Overview</SidebarGroupLabel>
        <SidebarMenuItem>
          <SidebarMenuButton asChild href={base}>Overview</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarMenuItem>
          <SidebarMenuButton asChild href={`${base}/secrets`}>Secrets</SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild href={`${base}/members`}>Members</SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild href={`${base}/invites`}>Invites</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Security</SidebarGroupLabel>
        <SidebarMenuItem>
          <SidebarMenuButton asChild href={`${base}/audit`}>Audit</SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild href={`${base}/settings`}>Settings</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroup>
    </SidebarMenu>
  );
}


