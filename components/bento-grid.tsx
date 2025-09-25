"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AttendanceChart } from "./attendance-chart"
import { AttendancePieChart, AttendanceStatusPieChart } from "./pie-chart"
import { CalendarWidget } from "./calendar-widget"
import { NoticeWidget } from "./notice-widget"
import { Users, GraduationCap, Clock, TrendingUp, Calendar, Bell } from "lucide-react"

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
      {/* Stats Cards - Row 1 */}
      <Card className="md:col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6 h-full flex flex-col justify-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Total Students</p>
              <p className="text-3xl font-bold text-blue-900">550</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6 h-full flex flex-col justify-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">Total Teachers</p>
              <p className="text-3xl font-bold text-green-900">20</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6 h-full flex flex-col justify-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">Attendance Rate</p>
              <p className="text-3xl font-bold text-purple-900">94.2%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6 h-full flex flex-col justify-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-700">Active Classes</p>
              <p className="text-3xl font-bold text-orange-900">12</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chart - Row 2 */}
      <Card className="md:col-span-2 lg:col-span-2 row-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="h-full min-h-[300px]">
            <AttendanceChart />
          </div>
        </CardContent>
      </Card>

      {/* Calendar Widget - Row 2 */}
      <Card className="md:col-span-1 row-span-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-hidden">
          <div className="h-full">
            <CalendarWidget />
          </div>
        </CardContent>
      </Card>

      {/* Notice Widget - Row 2 */}
      <Card className="md:col-span-1 row-span-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-hidden">
          <div className="h-full">
            <NoticeWidget />
          </div>
        </CardContent>
      </Card>

      {/* Pie Charts - Row 3 */}
      <Card className="md:col-span-1 row-span-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-hidden">
          <div className="h-full">
            <AttendancePieChart />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 row-span-1 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-hidden">
          <div className="h-full">
            <AttendanceStatusPieChart />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions - Row 3 */}
      <Card className="md:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity & Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Grade 5 attendance marked - 95% present</span>
                  <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">New student enrolled - Sarah Johnson</span>
                  <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
                </div>
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Absence notification sent to parent</span>
                  <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900">Take Attendance</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900">View Students</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900">Generate Report</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900">Send Notifications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
