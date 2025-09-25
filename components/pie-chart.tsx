"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

// Mock data for pie chart - attendance by grade
const attendanceByGrade = [
  { name: "Grade 1", value: 85, color: "#3b82f6" },
  { name: "Grade 2", value: 92, color: "#10b981" },
  { name: "Grade 3", value: 78, color: "#f59e0b" },
  { name: "Grade 4", value: 88, color: "#ef4444" },
  { name: "Grade 5", value: 95, color: "#8b5cf6" },
]

// Mock data for attendance status distribution
const attendanceStatus = [
  { name: "Present", value: 420, color: "#10b981" },
  { name: "Absent", value: 80, color: "#ef4444" },
  { name: "Late", value: 50, color: "#f59e0b" },
]

export function AttendancePieChart() {
  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Attendance by Grade</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceByGrade}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {attendanceByGrade.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-white p-3 shadow-lg">
                        <p className="text-sm font-medium text-gray-900">
                          {data.name}
                        </p>
                        <p className="text-sm text-blue-600">
                          Attendance: {data.value}%
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function AttendanceStatusPieChart() {
  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Today's Attendance Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {attendanceStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-white p-3 shadow-lg">
                        <p className="text-sm font-medium text-gray-900">
                          {data.name}
                        </p>
                        <p className="text-sm text-blue-600">
                          Students: {data.value}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
