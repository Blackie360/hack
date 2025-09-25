"use client"

import { useState } from "react"
import { useData } from "@/contexts/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Users, GraduationCap } from "lucide-react"
import { toast } from "sonner"

interface AddClassFormProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function AddClassForm({ trigger, onSuccess }: AddClassFormProps) {
  const { addClass, users, classes } = useData()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    teacherId: "",
    capacity: 30,
    status: "active" as "active" | "inactive"
  })

  const teachers = users.filter(user => user.role === 'teacher')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.grade || !formData.teacherId) {
        toast.error("Please fill in all required fields")
        return
      }

      // Check if class name already exists
      if (classes.some(cls => cls.name === formData.name)) {
        toast.error("Class name already exists")
        return
      }

      const selectedTeacher = teachers.find(teacher => teacher.id === formData.teacherId)

      // Add class
      addClass({
        name: formData.name,
        grade: formData.grade,
        teacherId: formData.teacherId,
        teacherName: selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : "",
        studentCount: 0,
        capacity: formData.capacity,
        status: formData.status
      })

      // Reset form
      setFormData({
        name: "",
        grade: "",
        teacherId: "",
        capacity: 30,
        status: "active"
      })

      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error adding class:", error)
      toast.error("Error adding class. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Add New Class</span>
          </DialogTitle>
          <DialogDescription>
            Create a new class and assign a teacher to it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Class 10A"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade *</Label>
            <Input
              id="grade"
              value={formData.grade}
              onChange={(e) => handleChange("grade", e.target.value)}
              placeholder="10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacherId">Teacher *</Label>
            <Select value={formData.teacherId} onValueChange={(value) => handleChange("teacherId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {teachers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No teachers found. Please add teachers first.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="50"
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", parseInt(e.target.value))}
              placeholder="30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || teachers.length === 0}>
              {loading ? "Adding..." : "Add Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
