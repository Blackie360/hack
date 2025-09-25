"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AttendanceChart } from "./attendance-chart"
import { AttendancePieChart, AttendanceStatusPieChart } from "./pie-chart"
import { CalendarWidget } from "./calendar-widget"
import { NoticeWidget } from "./notice-widget"
import { useData } from "@/contexts/data-context"
import { 
  Users, 
  GraduationCap, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Bell, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Activity,
  BookOpen,
  UserCheck,
  UserX,
  Target,
  Award,
  Zap,
  Eye,
  Download
} from "lucide-react"

// Quick actions for enhanced dashboard

// Recent activity will come from the data context

// Notifications will come from the data context

const quickActions = [
  {
    id: 1,
    title: "Take Attendance",
    description: "Mark today's attendance",
    icon: Calendar,
    color: "bg-blue-500",
    href: "/attendance"
  },
  {
    id: 2,
    title: "View Students",
    description: "Browse student directory",
    icon: Users,
    color: "bg-green-500",
    href: "/students"
  },
  {
    id: 3,
    title: "Generate Report",
    description: "Create attendance reports",
    icon: TrendingUp,
    color: "bg-purple-500",
    href: "/reports"
  },
  {
    id: 4,
    title: "Manage Data",
    description: "Add and edit data",
    icon: Bell,
    color: "bg-orange-500",
    href: "/data-management"
  }
]

export function EnhancedDashboard() {
  const { getSchoolStats, activityLogs, notifications } = useData()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [unreadNotifications, setUnreadNotifications] = useState(notifications.filter(n => !n.read).length)
  
  const stats = getSchoolStats()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info": return <Activity className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info": return <Bell className="h-4 w-4 text-blue-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Welcome back! Here's what's happening at DPM School today.
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="text-left md:text-right">
            <p className="text-xs md:text-sm font-medium text-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 3).map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex items-start space-x-3 p-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleDateString()}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Students */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalStudents}</p>
                <div className="flex items-center mt-1 md:mt-2">
                  <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
                  <span className="text-xs md:text-sm text-green-500">+{stats.newEnrollments} this month</span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-primary/10 rounded-xl">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.attendanceRate}%</p>
                <div className="mt-1 md:mt-2">
                  <Progress value={stats.attendanceRate} className="h-1 md:h-2" />
                </div>
              </div>
              <div className="p-2 md:p-3 bg-green-500/10 rounded-xl">
                <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Classes */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.activeClasses}</p>
                <div className="flex items-center mt-1 md:mt-2">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 text-blue-500 mr-1" />
                  <span className="text-xs md:text-sm text-blue-500">Currently in session</span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-blue-500/10 rounded-xl">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Grade */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Average Grade</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.averageGrade}%</p>
                <div className="flex items-center mt-1 md:mt-2">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-purple-500 mr-1" />
                  <span className="text-xs md:text-sm text-purple-500">+2.3% from last month</span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl">
                <Award className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Attendance Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-sm">Frequently used functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            {quickActions.map((action) => (
              <HoverCard key={action.id}>
                <HoverCardTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-3 md:p-4"
                    onClick={() => {
                      // Use Next.js router for better navigation
                      if (typeof window !== 'undefined') {
                        window.location.href = action.href
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className={`p-1.5 md:p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm md:text-base">{action.title}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-sm">Click to {action.description.toLowerCase()}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-sm">Latest updates and actions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="self-start md:self-auto">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {activityLogs.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium truncate">{activity.message}</p>
                    <div className="flex items-center space-x-1 md:space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">by {activity.user}</span>
                      <span className="text-xs text-muted-foreground hidden md:inline">•</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar Widget */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Calendar</CardTitle>
            <CardDescription className="text-sm">Upcoming events and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarWidget />
          </CardContent>
        </Card>

        {/* Pie Charts */}
        <div>
          <AttendanceStatusPieChart />
        </div>
      </div>

      {/* Additional Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Notices Widget */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notices</CardTitle>
            <CardDescription className="text-sm">Important announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <NoticeWidget />
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">System Status</CardTitle>
            <CardDescription className="text-sm">Current system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Database</span>
              </div>
              <Badge variant="outline" className="text-green-600">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">SMS Service</span>
              </div>
              <Badge variant="outline" className="text-green-600">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Backup</span>
              </div>
              <Badge variant="outline" className="text-yellow-600">In Progress</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">API</span>
              </div>
              <Badge variant="outline" className="text-green-600">Healthy</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
