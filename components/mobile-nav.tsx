"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Key, Users, Settings, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  slug: string;
};

export function MobileNav({ slug }: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: `/dashboard/organization/${slug}`,
      label: "Home",
      icon: Home,
      match: (path: string) => path === `/dashboard/organization/${slug}`,
    },
    {
      href: `/dashboard/organization/${slug}/secrets`,
      label: "Secrets",
      icon: Key,
      match: (path: string) => path.includes("/secrets"),
    },
    {
      href: `/dashboard/organization/${slug}/projects`,
      label: "Projects",
      icon: FolderGit2,
      match: (path: string) => path.includes("/projects"),
    },
    {
      href: `/dashboard/organization/${slug}/members`,
      label: "Members",
      icon: Users,
      match: (path: string) => path.includes("/members"),
    },
    {
      href: `/dashboard/organization/${slug}/settings`,
      label: "Settings",
      icon: Settings,
      match: (path: string) => path.includes("/settings"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.match(pathname);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

