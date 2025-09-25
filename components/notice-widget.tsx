"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Trophy, Bell } from "lucide-react"

export function NoticeWidget() {
  // Mock notices data
  const notices = [
    {
      id: 1,
      title: "Upcoming Examination",
      description: "Grade 5 Mathematics exam scheduled",
      date: "25 Sep 2024",
      type: "exam",
      icon: Calendar,
      color: "bg-red-100 text-red-800",
    },
    {
      id: 2,
      title: "School Holiday",
      description: "Independence Day holiday - school closed",
      date: "30 Sep 2024",
      type: "holiday",
      icon: Users,
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: 3,
      title: "Basketball Match",
      description: "Inter-school basketball tournament",
      date: "25 Sep 2024",
      type: "event",
      icon: Trophy,
      color: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      title: "Parent Meeting",
      description: "Monthly parent-teacher conference",
      date: "28 Sep 2024",
      type: "meeting",
      icon: Bell,
      color: "bg-blue-100 text-blue-800",
    },
  ]

  const getIcon = (iconType: any) => {
    const IconComponent = iconType
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Notices</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className={`p-2 rounded-full ${notice.color}`}>
                {getIcon(notice.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {notice.title}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {notice.date}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {notice.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Notices */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Notices →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
