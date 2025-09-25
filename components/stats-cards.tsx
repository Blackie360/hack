"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, GraduationCap } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total Students Card */}
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">550</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Teachers Card */}
      <Card className="bg-white border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">20</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
