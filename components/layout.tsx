"use client"

import { SidebarNav } from "./sidebar-nav"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50">
        <SidebarNav />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  )
}
