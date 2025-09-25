"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Save, 
  RotateCcw,
  UserCheck
} from "lucide-react"

// Mock student data
const mockStudents = [
  { id: 1, name: "John Doe", admissionNo: "ADM001", status: "present", remarks: "" },
  { id: 2, name: "Jane Smith", admissionNo: "ADM002", status: "absent", remarks: "Sick" },
  { id: 3, name: "Mike Johnson", admissionNo: "ADM003", status: "late", remarks: "" },
  { id: 4, name: "Sarah Wilson", admissionNo: "ADM004", status: "present", remarks: "" },
  { id: 5, name: "David Brown", admissionNo: "ADM005", status: "excused", remarks: "Doctor appointment" },
  { id: 6, name: "Emily Davis", admissionNo: "ADM006", status: "present", remarks: "" },
  { id: 7, name: "Chris Miller", admissionNo: "ADM007", status: "absent", remarks: "" },
  { id: 8, name: "Lisa Garcia", admissionNo: "ADM008", status: "present", remarks: "" },
]

const statusOptions = [
  { value: "present", label: "Present", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  { value: "absent", label: "Absent", icon: XCircle, color: "bg-red-100 text-red-800" },
  { value: "late", label: "Late", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  { value: "excused", label: "Excused", icon: FileText, color: "bg-blue-100 text-blue-800" },
]

export function AttendanceTable() {
  const [students, setStudents] = useState(mockStudents)
  const [selectedClass, setSelectedClass] = useState("grade-5")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false)
  const [tempRemarks, setTempRemarks] = useState("")

  const handleStatusChange = (studentId: number, status: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, status } : student
      )
    )
  }

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, remarks } : student
      )
    )
  }

  const openRemarksDialog = (student: any) => {
    setSelectedStudent(student)
    setTempRemarks(student.remarks)
    setRemarksDialogOpen(true)
  }

  const saveRemarks = () => {
    if (selectedStudent) {
      handleRemarksChange(selectedStudent.id, tempRemarks)
    }
    setRemarksDialogOpen(false)
    setSelectedStudent(null)
    setTempRemarks("")
  }

  const markAllPresent = () => {
    setStudents(prev => 
      prev.map(student => ({ ...student, status: "present" }))
    )
  }

  const resetAttendance = () => {
    setStudents(prev => 
      prev.map(student => ({ ...student, status: "present", remarks: "" }))
    )
  }

  const submitAttendance = () => {
    // Here you would typically send data to your backend
    console.log("Submitting attendance:", students)
    
    // Check for absent students to trigger SMS
    const absentStudents = students.filter(s => s.status === "absent")
    if (absentStudents.length > 0) {
      console.log("Triggering SMS for absent students:", absentStudents)
      // SMS integration would go here
    }
    
    alert("Attendance submitted successfully!")
  }

  const getStatusIcon = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status)
    return option ? option.icon : CheckCircle
  }

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status)
    return option ? option.color : "bg-green-100 text-green-800"
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Take Attendance</CardTitle>
              <p className="text-gray-600 mt-1">Mark attendance for your class</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">{students.length} Students</span>
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade-1">Grade 1</SelectItem>
                  <SelectItem value="grade-2">Grade 2</SelectItem>
                  <SelectItem value="grade-3">Grade 3</SelectItem>
                  <SelectItem value="grade-4">Grade 4</SelectItem>
                  <SelectItem value="grade-5">Grade 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={markAllPresent} variant="outline" className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4" />
                <span>Mark All Present</span>
              </Button>
              <Button onClick={resetAttendance} variant="outline" className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={submitAttendance} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Submit Attendance</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Student Name</TableHead>
                  <TableHead className="w-[120px]">Admission No.</TableHead>
                  <TableHead className="w-[200px]">Status</TableHead>
                  <TableHead className="w-[300px]">Remarks</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {student.admissionNo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <RadioGroup
                        value={student.status}
                        onValueChange={(value) => handleStatusChange(student.id, value)}
                        className="flex flex-row space-x-4"
                      >
                        {statusOptions.map((option) => {
                          const IconComponent = option.icon
                          return (
                            <div key={option.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.value} id={`${student.id}-${option.value}`} />
                              <Label 
                                htmlFor={`${student.id}-${option.value}`}
                                className="flex items-center space-x-1 cursor-pointer"
                              >
                                <IconComponent className="h-4 w-4" />
                                <span className="text-sm">{option.label}</span>
                              </Label>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {student.remarks ? (
                          <Badge className={getStatusColor(student.status)}>
                            {student.remarks}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">No remarks</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog open={remarksDialogOpen && selectedStudent?.id === student.id} onOpenChange={setRemarksDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openRemarksDialog(student)}
                            className="flex items-center space-x-1"
                          >
                            <FileText className="h-4 w-4" />
                            <span>Add Note</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add Remarks for {selectedStudent?.name}</DialogTitle>
                            <DialogDescription>
                              Add any notes or remarks for this student's attendance.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="remarks">Remarks</Label>
                              <Textarea
                                id="remarks"
                                placeholder="Enter remarks..."
                                value={tempRemarks}
                                onChange={(e) => setTempRemarks(e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setRemarksDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={saveRemarks}>
                              Save Remarks
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusOptions.map((option) => {
              const count = students.filter(s => s.status === option.value).length
              const IconComponent = option.icon
              return (
                <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{option.label}</p>
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

