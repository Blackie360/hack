"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2, MessageSquare } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SMSModal } from "@/components/sms-modal"

import type { Student } from "./student-data-table"

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "avatar",
    header: "",
    cell: ({ row }) => {
      const student = row.original
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={student.avatar} alt={`${student.firstName} ${student.lastName}`} />
          <AvatarFallback>
            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const student = row.original
      return (
        <div>
          <div className="font-medium">{student.firstName} {student.lastName}</div>
          <div className="text-sm text-muted-foreground">{student.studentId}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("email")}</div>
    },
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => {
      const student = row.original
      return (
        <div>
          <div className="font-medium">{student.class}</div>
          <div className="text-sm text-muted-foreground">Grade {student.grade}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "attendance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Attendance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const attendance = parseFloat(row.getValue("attendance"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(attendance / 100)
      
      return (
        <div className="text-center">
          <div className={`font-medium ${attendance >= 80 ? 'text-green-600' : attendance >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {formatted}
          </div>
          <div className="text-xs text-muted-foreground">
            {attendance >= 80 ? 'Good' : attendance >= 60 ? 'Fair' : 'Poor'}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusConfig = {
        active: { label: "Active", variant: "default" as const },
        inactive: { label: "Inactive", variant: "secondary" as const },
        suspended: { label: "Suspended", variant: "destructive" as const },
      }
      
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
      
      return <Badge variant={config.variant}>{config.label}</Badge>
    },
  },
  {
    accessorKey: "enrollmentDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Enrolled
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("enrollmentDate"))
      return <div className="text-sm">{format(date, "MMM dd, yyyy")}</div>
    },
  },
  {
    id: "sms",
    header: "SMS",
    cell: ({ row }) => {
      const student = row.original
      
      // Only show SMS button if parent phone is available
      if (!student.parentPhone) {
        return (
          <div className="text-xs text-muted-foreground">
            No parent phone
          </div>
        )
      }

      return (
        <SMSModal
          student={{
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            parentName: student.parentName || 'Parent/Guardian',
            parentPhone: student.parentPhone,
            class: student.class
          }}
          teacherName="Teacher" // This should come from user context
          trigger={
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              SMS
            </Button>
          }
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.studentId)}
            >
              Copy student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit student
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete student
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
