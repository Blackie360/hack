// Core data types for the school management system

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  studentId: string
  class: string
  grade: string
  attendance: number
  status: "active" | "inactive" | "suspended"
  phone: string
  address: string
  parentName: string
  parentPhone: string
  enrollmentDate: string
  createdAt?: string
  updatedAt?: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  remarks?: string
  markedBy: string
  createdAt: string
  updatedAt: string
}

export interface SchoolStats {
  totalStudents: number
  totalTeachers: number
  attendanceRate: number
  activeClasses: number
  newEnrollments: number
  pendingApplications: number
  averageGrade: number
  parentSatisfaction: number
}

export interface ActivityLog {
  id: string
  type: "attendance" | "enrollment" | "notification" | "grade" | "meeting" | "system"
  message: string
  time: string
  status: "success" | "warning" | "info" | "error"
  user: string
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
  userId?: string
}

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  color: string
  href: string
  enabled: boolean
}

export interface SchoolSettings {
  schoolName: string
  schoolCode: string
  address: string
  phone: string
  email: string
  website: string
  principalName: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  attendanceAlerts: boolean
  gradeAlerts: boolean
  eventReminders: boolean
}

export interface SystemSettings {
  sessionTimeout: number
  maxLoginAttempts: number
  passwordPolicy: string
  backupFrequency: string
  maintenanceMode: boolean
}

export interface SMSSettings {
  apiKey: string
  username: string
  senderId: string
  enabled: boolean
  costPerSms: number
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "teacher" | "parent" | "student"
  status: "active" | "inactive"
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Class {
  id: string
  name: string
  grade: string
  teacherId: string
  teacherName: string
  studentCount: number
  capacity: number
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Report {
  id: string
  title: string
  type: "attendance" | "academic" | "financial" | "enrollment"
  dateRange: {
    from: string
    to: string
  }
  filters: {
    class?: string
    grade?: string
    status?: string
  }
  generatedBy: string
  createdAt: string
  data: any
}
