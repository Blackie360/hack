"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Mail,
  Phone,
  User,
  Calendar,
  GraduationCap,
} from "lucide-react"

// Mock student data
const mockStudents = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    admissionNo: "ADM001",
    email: "john.doe@school.edu",
    phone: "+1234567890",
    grade: "Grade 5",
    class: "5A",
    dateOfBirth: "2010-05-15",
    parentName: "Jane Doe",
    parentPhone: "+1234567891",
    address: "123 Main St, City",
    status: "active",
    attendanceRate: 95,
    joinDate: "2023-09-01",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    admissionNo: "ADM002",
    email: "jane.smith@school.edu",
    phone: "+1234567892",
    grade: "Grade 5",
    class: "5A",
    dateOfBirth: "2010-03-22",
    parentName: "Bob Smith",
    parentPhone: "+1234567893",
    address: "456 Oak Ave, City",
    status: "active",
    attendanceRate: 88,
    joinDate: "2023-09-01",
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    admissionNo: "ADM003",
    email: "mike.johnson@school.edu",
    phone: "+1234567894",
    grade: "Grade 4",
    class: "4B",
    dateOfBirth: "2011-08-10",
    parentName: "Sarah Johnson",
    parentPhone: "+1234567895",
    address: "789 Pine St, City",
    status: "active",
    attendanceRate: 92,
    joinDate: "2023-09-01",
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Wilson",
    admissionNo: "ADM004",
    email: "sarah.wilson@school.edu",
    phone: "+1234567896",
    grade: "Grade 5",
    class: "5A",
    dateOfBirth: "2010-12-05",
    parentName: "Tom Wilson",
    parentPhone: "+1234567897",
    address: "321 Elm St, City",
    status: "inactive",
    attendanceRate: 75,
    joinDate: "2023-09-01",
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Brown",
    admissionNo: "ADM005",
    email: "david.brown@school.edu",
    phone: "+1234567898",
    grade: "Grade 4",
    class: "4A",
    dateOfBirth: "2011-01-18",
    parentName: "Lisa Brown",
    parentPhone: "+1234567899",
    address: "654 Maple Ave, City",
    status: "active",
    attendanceRate: 98,
    joinDate: "2023-09-01",
  },
]

export function StudentsTable() {
  const [students, setStudents] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter
      const matchesStatus = statusFilter === "all" || student.status === statusFilter
      
      return matchesSearch && matchesGrade && matchesStatus
    })
  }, [students, searchTerm, gradeFilter, statusFilter])

  const openViewDialog = (student: any) => {
    setSelectedStudent(student)
    setViewDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-red-100 text-red-800"
      case "suspended": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return "bg-green-100 text-green-800"
    if (rate >= 85) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Students List</CardTitle>
              <p className="text-gray-600 mt-1">Manage and view all enrolled students</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">{filteredStudents.length} Students</span>
              </div>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Student</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students by name, admission number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="Grade 1">Grade 1</SelectItem>
                  <SelectItem value="Grade 2">Grade 2</SelectItem>
                  <SelectItem value="Grade 3">Grade 3</SelectItem>
                  <SelectItem value="Grade 4">Grade 4</SelectItem>
                  <SelectItem value="Grade 5">Grade 5</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Grade/Class</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{student.firstName} {student.lastName}</p>
                          <p className="text-sm text-gray-500">{student.parentName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {student.admissionNo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.grade}</p>
                        <p className="text-sm text-gray-500">{student.class}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{student.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAttendanceColor(student.attendanceRate)}>
                        {student.attendanceRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openViewDialog(student)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                  <p className="text-lg font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Admission Number</Label>
                  <p className="text-lg font-semibold">{selectedStudent.admissionNo}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Grade & Class</Label>
                  <p className="text-lg font-semibold">{selectedStudent.grade} - {selectedStudent.class}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                  <p className="text-lg font-semibold">{selectedStudent.dateOfBirth}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-lg font-semibold">{selectedStudent.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-lg font-semibold">{selectedStudent.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Parent Name</Label>
                  <p className="text-lg font-semibold">{selectedStudent.parentName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Parent Phone</Label>
                  <p className="text-lg font-semibold">{selectedStudent.parentPhone}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Address</Label>
                <p className="text-lg font-semibold">{selectedStudent.address}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={getStatusColor(selectedStudent.status)}>
                    {selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Attendance Rate</Label>
                  <Badge className={getAttendanceColor(selectedStudent.attendanceRate)}>
                    {selectedStudent.attendanceRate}%
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Join Date</Label>
                  <p className="text-lg font-semibold">{selectedStudent.joinDate}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button>
              Edit Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
