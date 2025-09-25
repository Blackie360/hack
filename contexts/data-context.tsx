"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'
import type { 
  Student, 
  AttendanceRecord, 
  SchoolStats, 
  ActivityLog, 
  Notification, 
  QuickAction,
  SchoolSettings,
  NotificationSettings,
  SystemSettings,
  SMSSettings,
  User,
  Class,
  Report
} from '@/types'

interface DataContextType {
  // Students
  students: Student[]
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void
  
  // Attendance
  attendanceRecords: AttendanceRecord[]
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => void
  
  // Classes
  classes: Class[]
  addClass: (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateClass: (id: string, classData: Partial<Class>) => void
  deleteClass: (id: string) => void
  
  // Users
  users: User[]
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateUser: (id: string, user: Partial<User>) => void
  deleteUser: (id: string) => void
  
  // Settings
  schoolSettings: SchoolSettings
  updateSchoolSettings: (settings: Partial<SchoolSettings>) => void
  
  notificationSettings: NotificationSettings
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  
  systemSettings: SystemSettings
  updateSystemSettings: (settings: Partial<SystemSettings>) => void
  
  smsSettings: SMSSettings
  updateSMSSettings: (settings: Partial<SMSSettings>) => void
  
  // Activity Log
  activityLogs: ActivityLog[]
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'createdAt'>) => void
  
  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationAsRead: (id: string) => void
  
  // Reports
  reports: Report[]
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void
  
  // Stats (calculated from data)
  getSchoolStats: () => SchoolStats
  
  // Data persistence
  saveData: () => void
  loadData: () => void
  clearAllData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Default settings
const defaultSchoolSettings: SchoolSettings = {
  schoolName: "",
  schoolCode: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  principalName: ""
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  attendanceAlerts: true,
  gradeAlerts: true,
  eventReminders: true
}

const defaultSystemSettings: SystemSettings = {
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordPolicy: "strong",
  backupFrequency: "daily",
  maintenanceMode: false
}

const defaultSMSSettings: SMSSettings = {
  apiKey: "",
  username: "",
  senderId: "",
  enabled: false,
  costPerSms: 0.05
}

export function DataProvider({ children }: { children: ReactNode }) {
  // State
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(defaultSchoolSettings)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(defaultSystemSettings)
  const [smsSettings, setSmsSettings] = useState<SMSSettings>(defaultSMSSettings)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [reports, setReports] = useState<Report[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    loadData()
  }, [])

  // Save data to localStorage whenever data changes
  useEffect(() => {
    saveData()
  }, [students, attendanceRecords, classes, users, schoolSettings, notificationSettings, systemSettings, smsSettings, activityLogs, notifications, reports])

  // Student functions
  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setStudents(prev => [...prev, newStudent])
    addActivityLog({
      type: "enrollment",
      message: `New student enrolled: ${studentData.firstName} ${studentData.lastName}`,
      time: "Just now",
      status: "success",
      user: "Admin"
    })
    toast.success(`Student ${studentData.firstName} ${studentData.lastName} added successfully!`)
  }

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id 
        ? { ...student, ...studentData, updatedAt: new Date().toISOString() }
        : student
    ))
    toast.success("Student updated successfully!")
  }

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id)
    setStudents(prev => prev.filter(student => student.id !== id))
    if (student) {
      addActivityLog({
        type: "enrollment",
        message: `Student removed: ${student.firstName} ${student.lastName}`,
        time: "Just now",
        status: "warning",
        user: "Admin"
      })
      toast.success(`Student ${student.firstName} ${student.lastName} removed successfully!`)
    }
  }

  // Attendance functions
  const addAttendanceRecord = (recordData: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setAttendanceRecords(prev => [...prev, newRecord])
    addActivityLog({
      type: "attendance",
      message: `Attendance marked for ${recordData.studentName} - ${recordData.status}`,
      time: "Just now",
      status: "success",
      user: recordData.markedBy
    })
  }

  const updateAttendanceRecord = (id: string, recordData: Partial<AttendanceRecord>) => {
    setAttendanceRecords(prev => prev.map(record => 
      record.id === id 
        ? { ...record, ...recordData, updatedAt: new Date().toISOString() }
        : record
    ))
  }

  // Class functions
  const addClass = (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setClasses(prev => [...prev, newClass])
    addActivityLog({
      type: "system",
      message: `New class created: ${classData.name}`,
      time: "Just now",
      status: "success",
      user: "Admin"
    })
    toast.success(`Class ${classData.name} created successfully!`)
  }

  const updateClass = (id: string, classData: Partial<Class>) => {
    setClasses(prev => prev.map(cls => 
      cls.id === id 
        ? { ...cls, ...classData, updatedAt: new Date().toISOString() }
        : cls
    ))
    toast.success("Class updated successfully!")
  }

  const deleteClass = (id: string) => {
    const classToDelete = classes.find(c => c.id === id)
    setClasses(prev => prev.filter(cls => cls.id !== id))
    if (classToDelete) {
      addActivityLog({
        type: "system",
        message: `Class removed: ${classToDelete.name}`,
        time: "Just now",
        status: "warning",
        user: "Admin"
      })
      toast.success(`Class ${classToDelete.name} removed successfully!`)
    }
  }

  // User functions
  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setUsers(prev => [...prev, newUser])
    addActivityLog({
      type: "system",
      message: `New user added: ${userData.firstName} ${userData.lastName} (${userData.role})`,
      time: "Just now",
      status: "success",
      user: "Admin"
    })
    toast.success(`User ${userData.firstName} ${userData.lastName} added successfully!`)
  }

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, ...userData, updatedAt: new Date().toISOString() }
        : user
    ))
    toast.success("User updated successfully!")
  }

  const deleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id)
    setUsers(prev => prev.filter(user => user.id !== id))
    if (userToDelete) {
      addActivityLog({
        type: "system",
        message: `User removed: ${userToDelete.firstName} ${userToDelete.lastName}`,
        time: "Just now",
        status: "warning",
        user: "Admin"
      })
      toast.success(`User ${userToDelete.firstName} ${userToDelete.lastName} removed successfully!`)
    }
  }

  // Settings functions
  const updateSchoolSettings = (settings: Partial<SchoolSettings>) => {
    setSchoolSettings(prev => ({ ...prev, ...settings }))
    toast.success("School settings updated successfully!")
  }

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }))
    toast.success("Notification settings updated successfully!")
  }

  const updateSystemSettings = (settings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...settings }))
    toast.success("System settings updated successfully!")
  }

  const updateSMSSettings = (settings: Partial<SMSSettings>) => {
    setSmsSettings(prev => ({ ...prev, ...settings }))
    toast.success("SMS settings updated successfully!")
  }

  // Activity log functions
  const addActivityLog = (logData: Omit<ActivityLog, 'id' | 'createdAt'>) => {
    const newLog: ActivityLog = {
      ...logData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setActivityLogs(prev => [newLog, ...prev].slice(0, 100)) // Keep only last 100 logs
  }

  // Notification functions
  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, read: true }
        : notification
    ))
  }

  // Report functions
  const addReport = (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setReports(prev => [...prev, newReport])
    toast.success("Report generated successfully!")
  }

  // Calculate school stats from actual data
  const getSchoolStats = (): SchoolStats => {
    const totalStudents = students.length
    const totalTeachers = users.filter(user => user.role === 'teacher').length
    const activeClasses = classes.filter(cls => cls.status === 'active').length
    const newEnrollments = students.filter(student => {
      const enrollmentDate = new Date(student.enrollmentDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return enrollmentDate >= thirtyDaysAgo
    }).length
    
    // Calculate attendance rate from recent records
    const recentRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return recordDate >= thirtyDaysAgo
    })
    
    const attendanceRate = recentRecords.length > 0 
      ? (recentRecords.filter(record => record.status === 'present').length / recentRecords.length) * 100
      : 0

    const averageGrade = students.length > 0 
      ? students.reduce((sum, student) => {
          const gradeValue = student.grade === 'A' ? 90 : student.grade === 'B' ? 80 : student.grade === 'C' ? 70 : 60
          return sum + gradeValue
        }, 0) / students.length
      : 0

    return {
      totalStudents,
      totalTeachers,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      activeClasses,
      newEnrollments,
      pendingApplications: 0, // This would come from applications data
      averageGrade: Math.round(averageGrade * 10) / 10,
      parentSatisfaction: 4.5 // This would come from feedback data
    }
  }

  // Data persistence functions
  const saveData = () => {
    const data = {
      students,
      attendanceRecords,
      classes,
      users,
      schoolSettings,
      notificationSettings,
      systemSettings,
      smsSettings,
      activityLogs,
      notifications,
      reports
    }
    localStorage.setItem('school-management-data', JSON.stringify(data))
  }

  const loadData = () => {
    try {
      const savedData = localStorage.getItem('school-management-data')
      if (savedData) {
        const data = JSON.parse(savedData)
        setStudents(data.students || [])
        setAttendanceRecords(data.attendanceRecords || [])
        setClasses(data.classes || [])
        setUsers(data.users || [])
        setSchoolSettings({ ...defaultSchoolSettings, ...data.schoolSettings })
        setNotificationSettings({ ...defaultNotificationSettings, ...data.notificationSettings })
        setSystemSettings({ ...defaultSystemSettings, ...data.systemSettings })
        setSmsSettings({ ...defaultSMSSettings, ...data.smsSettings })
        setActivityLogs(data.activityLogs || [])
        setNotifications(data.notifications || [])
        setReports(data.reports || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Error loading saved data')
    }
  }

  const clearAllData = () => {
    setStudents([])
    setAttendanceRecords([])
    setClasses([])
    setUsers([])
    setSchoolSettings(defaultSchoolSettings)
    setNotificationSettings(defaultNotificationSettings)
    setSystemSettings(defaultSystemSettings)
    setSmsSettings(defaultSMSSettings)
    setActivityLogs([])
    setNotifications([])
    setReports([])
    localStorage.removeItem('school-management-data')
    toast.success('All data cleared successfully!')
  }

  const value: DataContextType = {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    attendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    classes,
    addClass,
    updateClass,
    deleteClass,
    users,
    addUser,
    updateUser,
    deleteUser,
    schoolSettings,
    updateSchoolSettings,
    notificationSettings,
    updateNotificationSettings,
    systemSettings,
    updateSystemSettings,
    smsSettings,
    updateSMSSettings,
    activityLogs,
    addActivityLog,
    notifications,
    addNotification,
    markNotificationAsRead,
    reports,
    addReport,
    getSchoolStats,
    saveData,
    loadData,
    clearAllData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
