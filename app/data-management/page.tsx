"use client"

import { useData } from "@/contexts/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddStudentForm } from "@/components/forms/add-student-form"
import { AddClassForm } from "@/components/forms/add-class-form"
import { AddUserForm } from "@/components/forms/add-user-form"
import { 
  Users, 
  GraduationCap, 
  UserPlus, 
  Plus,
  Trash2,
  Settings,
  Database
} from "lucide-react"
import { toast } from "sonner"

export default function DataManagementPage() {
  const { 
    students, 
    classes, 
    users, 
    clearAllData,
    getSchoolStats 
  } = useData()

  const stats = getSchoolStats()

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearAllData()
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Database className="h-8 w-8" />
            <span>Data Management</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your school data - add students, classes, and users
          </p>
        </div>
        <Button 
          variant="destructive" 
          onClick={handleClearAllData}
          className="flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All Data</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
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
                <p className="text-sm text-muted-foreground">Total Teachers</p>
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
                <p className="text-sm text-muted-foreground">Active Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.newEnrollments}</p>
                <p className="text-sm text-muted-foreground">New Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management Tabs */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span>Classes</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Students ({students.length})</span>
              </CardTitle>
              <AddStudentForm />
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No students added yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first student to the system
                  </p>
                  <AddStudentForm 
                    trigger={
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Student
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{student.firstName} {student.lastName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {student.studentId} • {student.class} • {student.grade}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          student.status === 'active' ? 'bg-green-100 text-green-800' :
                          student.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Classes ({classes.length})</span>
              </CardTitle>
              <AddClassForm />
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No classes created yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first class and assign a teacher to it
                  </p>
                  <AddClassForm 
                    trigger={
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Class
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{cls.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Grade {cls.grade} • {cls.teacherName} • {cls.studentCount}/{cls.capacity} students
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          cls.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {cls.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Users ({users.length})</span>
              </CardTitle>
              <AddUserForm />
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users added yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add teachers, parents, and other staff members to the system
                  </p>
                  <AddUserForm 
                    trigger={
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First User
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{user.firstName} {user.lastName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.email} • {user.role}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
