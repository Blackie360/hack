"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CalendarWidget() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock events data
  const events = [
    { date: new Date(2024, 8, 15), title: "Parent-Teacher Meeting", type: "meeting" },
    { date: new Date(2024, 8, 20), title: "School Assembly", type: "event" },
    { date: new Date(2024, 8, 25), title: "Examination", type: "exam" },
    { date: new Date(2024, 8, 30), title: "Holiday", type: "holiday" },
  ]

  const getEventForDate = (date: Date) => {
    return events.find(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    )
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return "bg-blue-100 text-blue-800"
      case "event": return "bg-green-100 text-green-800"
      case "exam": return "bg-red-100 text-red-800"
      case "holiday": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Calendar</CardTitle>
        <div className="flex items-center space-x-2">
          <ChevronLeft className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">September 2024</span>
          <ChevronRight className="h-4 w-4 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border-0"
            classNames={{
              day_selected: "bg-blue-600 text-white hover:bg-blue-700",
              day_today: "bg-blue-50 text-blue-900 font-semibold",
            }}
          />
          
          {/* Events for selected date */}
          {date && getEventForDate(date) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Today's Events</h4>
              <Badge className={getEventTypeColor(getEventForDate(date)!.type)}>
                {getEventForDate(date)!.title}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
