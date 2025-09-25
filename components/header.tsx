"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Search, Bell, Clock, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const pathname = usePathname()

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/':
        return 'Dashboard'
      case '/attendance':
        return 'Take Attendance'
      case '/students':
        return 'Students List'
      case '/reports':
        return 'Reports'
      case '/settings':
        return 'Settings'
      default:
        return 'Dashboard'
    }
  }

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Page title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">{getPageTitle(pathname)}</h1>
        </div>

        {/* Right side - Search, Time, Notifications, User */}
        <div className="flex items-center space-x-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Student ID"
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Current Time */}
          <Button
            variant="outline"
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <Clock className="h-4 w-4" />
            <span className="font-medium">{formatTime(currentTime)}</span>
          </Button>

          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-full hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="bg-blue-600 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@dpmschool.edu
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
