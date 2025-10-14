import Link from "next/link";
import CommandMenu from "@/components/command-menu";
import { MobileNav } from "@/components/mobile-nav";
import CryptoProvider from "@/components/security/crypto-provider";
import { getOrganizationBySlug } from "@/server/organizations";
import { getOrganizations } from "@/server/organizations";
import { getCurrentUser } from "@/server/users";
import { Icon } from "@iconify/react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Separator } from "@/components/ui/separator";

export default async function OrgLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);
  const { currentUser } = await getCurrentUser();
  
  return (
    <CryptoProvider orgId={organization?.id || ""}>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href={`/dashboard/organization/${slug}`}>
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Icon icon="mdi:office-building" className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{organization?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">Organization</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          
          <SidebarContent>
            <OrgSidebar params={params} />
          </SidebarContent>
          
          <SidebarFooter>
            <UserNav name={currentUser.name} email={currentUser.email} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <CommandMenu />
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
        
        {/* Mobile Bottom Navigation */}
        <MobileNav slug={slug} />
      </SidebarProvider>
    </CryptoProvider>
  );
}


async function OrgSidebar({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = `/dashboard/organization/${slug}`;
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={base}>
                  <Icon icon="mdi:view-dashboard" className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`${base}/secrets`}>
                  <Icon icon="mdi:key" className="size-4" />
                  <span>Secrets</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`${base}/members`}>
                  <Icon icon="mdi:account-multiple" className="size-4" />
                  <span>Members</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`${base}/invites`}>
                  <Icon icon="mdi:email" className="size-4" />
                  <span>Invites</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Security</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`${base}/audit`}>
                  <Icon icon="mdi:shield-check" className="size-4" />
                  <span>Audit</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`${base}/settings`}>
                  <Icon icon="mdi:cog" className="size-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}


