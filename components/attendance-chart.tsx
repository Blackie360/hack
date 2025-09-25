"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Mock data for attendance statistics
const attendanceData6Months = [
  { month: "Apr", attendance: 320 },
  { month: "May", attendance: 380 },
  { month: "Jun", attendance: 420 },
  { month: "Jul", attendance: 350 },
  { month: "Aug", attendance: 410 },
  { month: "Sep", attendance: 370 },
]

const attendanceData1Year = [
  { month: "Jan", attendance: 280 },
  { month: "Feb", attendance: 310 },
  { month: "Mar", attendance: 340 },
  { month: "Apr", attendance: 320 },
  { month: "May", attendance: 380 },
  { month: "Jun", attendance: 420 },
  { month: "Jul", attendance: 350 },
  { month: "Aug", attendance: 410 },
  { month: "Sep", attendance: 370 },
  { month: "Oct", attendance: 390 },
  { month: "Nov", attendance: 360 },
  { month: "Dec", attendance: 400 },
]

export function AttendanceChart() {
  const [timeRange, setTimeRange] = useState("6months")
  
  const currentData = timeRange === "6months" ? attendanceData6Months : attendanceData1Year

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Attendance Overview</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 500]}
                tickCount={6}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-white p-3 shadow-lg">
                        <p className="text-sm font-medium text-gray-900">
                          {label}
                        </p>
                        <p className="text-sm text-blue-600">
                          Attendance: {payload[0].value}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorAttendance)"
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
