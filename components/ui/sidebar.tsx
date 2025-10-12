"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SidebarContextValue = {
  open: boolean;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children, defaultOpen = true }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const value = React.useMemo(() => ({ open, toggle: () => setOpen((o) => !o) }), [open]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

export function Sidebar({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = useSidebar();
  return (
    <aside
      className={cn(
        "border-r border-border bg-card/50 backdrop-blur-sm",
        open ? "w-64" : "w-16",
        "transition-all duration-200",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle } = useSidebar();
  return (
    <button
      type="button"
      aria-label="Toggle sidebar"
      onClick={toggle}
      className={cn(
        "inline-flex h-9 items-center rounded-md border px-2 text-xs text-muted-foreground hover:bg-accent",
        className
      )}
    >
      Toggle
    </button>
  );
}

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-3", className)}>{children}</div>;
}

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-2 pb-3", className)}>{children}</div>;
}

export function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mt-auto p-3", className)}>{children}</div>;
}

export function SidebarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-3", className)}>{children}</div>;
}

export function SidebarGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-3 pb-1 text-xs text-muted-foreground", className)}>{children}</div>;
}

export function SidebarMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>;
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

export function SidebarMenuButton({
  children,
  className,
  active,
  asChild,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  asChild?: boolean;
  href?: string;
}) {
  const content = (
    <div
      className={cn(
        "flex h-9 items-center gap-2 rounded-md px-2 text-sm",
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </div>
  );
  if (asChild && href) {
    return <a href={href}>{content}</a>;
  }
  return content;
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 min-w-0">{children}</div>;
}


