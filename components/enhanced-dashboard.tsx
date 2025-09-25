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

// Mock data for enhanced dashboard
const mockStats = {
  totalStudents: 550,
  totalTeachers: 20,
  attendanceRate: 94.2,
  activeClasses: 12,
  newEnrollments: 8,
  pendingApplications: 3,
  averageGrade: 85.6,
  parentSatisfaction: 4.8
}

const mockRecentActivity = [
  {
    id: 1,
    type: "attendance",
    message: "Grade 5 attendance marked - 95% present",
    time: "2 min ago",
    status: "success",
    user: "Ms. Johnson"
  },
  {
    id: 2,
    type: "enrollment",
    message: "New student enrolled - Sarah Johnson",
    time: "15 min ago",
    status: "info",
    user: "Admin"
  },
  {
    id: 3,
    type: "notification",
    message: "Absence notification sent to parent",
    time: "1 hour ago",
    status: "warning",
    user: "System"
  },
  {
    id: 4,
    type: "grade",
    message: "Math test results uploaded for Grade 3",
    time: "2 hours ago",
    status: "success",
    user: "Mr. Smith"
  },
  {
    id: 5,
    type: "meeting",
    message: "Parent-teacher meeting scheduled",
    time: "3 hours ago",
    status: "info",
    user: "Ms. Davis"
  }
]

const mockNotifications = [
  {
    id: 1,
    title: "Low Attendance Alert",
    message: "Grade 2 attendance below 80%",
    time: "5 min ago",
    type: "warning",
    read: false
  },
  {
    id: 2,
    title: "New Application",
    message: "3 new student applications received",
    time: "1 hour ago",
    type: "info",
    read: false
  },
  {
    id: 3,
    title: "System Update",
    message: "Scheduled maintenance tonight at 10 PM",
    time: "2 hours ago",
    type: "info",
    read: true
  }
]

const mockQuickActions = [
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
    title: "Send Notifications",
    description: "Notify parents and staff",
    icon: Bell,
    color: "bg-orange-500",
    href: "/notifications"
  }
]

export function EnhancedDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [unreadNotifications, setUnreadNotifications] = useState(2)

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
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening at DPM School today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-muted-foreground">
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
              {mockNotifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex items-start space-x-3 p-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{mockStats.totalStudents}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+{mockStats.newEnrollments} this month</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-3xl font-bold text-foreground">{mockStats.attendanceRate}%</p>
                <div className="mt-2">
                  <Progress value={mockStats.attendanceRate} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Classes */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="text-3xl font-bold text-foreground">{mockStats.activeClasses}</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-500">Currently in session</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Grade */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                <p className="text-3xl font-bold text-foreground">{mockStats.averageGrade}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-500">+2.3% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Monthly attendance trends and patterns</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockQuickActions.map((action) => (
              <HoverCard key={action.id}>
                <HoverCardTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-4"
                    onClick={() => window.location.href = action.href}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and actions</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">by {activity.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
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
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Upcoming events and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarWidget />
          </CardContent>
        </Card>

        {/* Pie Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Status</CardTitle>
            <CardDescription>Today's attendance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceStatusPieChart />
          </CardContent>
        </Card>
      </div>

      {/* Additional Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notices Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Notices</CardTitle>
            <CardDescription>Important announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <NoticeWidget />
          </CardContent>
        </Card>

        {/* Attendance by Grade */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Grade</CardTitle>
            <CardDescription>Grade-wise attendance distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendancePieChart />
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
