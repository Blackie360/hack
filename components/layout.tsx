"use client"

import { useState } from "react"
import { SidebarNav } from "./sidebar-nav"
import { Header } from "./header"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen flex">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'fixed inset-y-0 left-0 z-50'
        }
      `}>
        <SidebarNav onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 ${isMobile ? 'ml-0' : 'ml-64'}`}>
        {/* Header with Mobile Menu Button */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
