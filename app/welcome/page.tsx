"use client"

import { useData } from "@/contexts/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddStudentForm } from "@/components/forms/add-student-form"
import { AddClassForm } from "@/components/forms/add-class-form"
import { AddUserForm } from "@/components/forms/add-user-form"
import { 
  Users, 
  GraduationCap, 
  UserPlus, 
  ArrowRight,
  Database,
  CheckCircle,
  Plus
} from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const { students, classes, users, getSchoolStats } = useData()
  const stats = getSchoolStats()

  const hasData = students.length > 0 || classes.length > 0 || users.length > 0

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Database className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold">Welcome to School Management</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {hasData 
            ? "Your school management system is ready! Manage students, classes, and users."
            : "Get started by adding your first data to the system. You can add students, create classes, and manage users."
          }
        </p>
      </div>

      {/* Quick Stats */}
      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                  <p className="text-sm text-muted-foreground">Teachers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.activeClasses}</p>
                  <p className="text-sm text-muted-foreground">Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.attendanceRate}%</p>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Getting Started Section */}
      {!hasData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Getting Started</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              To get started with your school management system, you'll need to add some basic data. 
              We recommend starting with users (teachers), then creating classes, and finally adding students.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Add Users */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <h3 className="text-lg font-semibold">Add Users</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add teachers, administrators, and other staff members to the system.
                </p>
                <AddUserForm 
                  trigger={
                    <Button className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add First User
                    </Button>
                  }
                />
              </div>

              {/* Step 2: Create Classes */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <h3 className="text-lg font-semibold">Create Classes</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create classes and assign teachers to them.
                </p>
                <AddClassForm 
                  trigger={
                    <Button className="w-full" disabled={users.length === 0}>
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Create First Class
                    </Button>
                  }
                />
                {users.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add users first to create classes
                  </p>
                )}
              </div>

              {/* Step 3: Add Students */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <h3 className="text-lg font-semibold">Add Students</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add students to your classes and start managing attendance.
                </p>
                <AddStudentForm 
                  trigger={
                    <Button className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Add First Student
                    </Button>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/attendance">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Take Attendance</h3>
                  <p className="text-sm text-muted-foreground">Mark student attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/students">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">View Students</h3>
                  <p className="text-sm text-muted-foreground">Browse student directory</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reports">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Generate Reports</h3>
                  <p className="text-sm text-muted-foreground">Create attendance reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/data-management">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Database className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Data</h3>
                  <p className="text-sm text-muted-foreground">Add and edit data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Continue to Dashboard */}
      {hasData && (
        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="flex items-center space-x-2">
              <span>Continue to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
