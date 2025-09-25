"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  BookOpen, 
  Award,
  AlertCircle,
  CheckCircle
} from "lucide-react"

export function ReportSummary() {
  const stats = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+5.2%",
      trend: "up" as const,
      icon: Users,
      description: "From last month"
    },
    {
      title: "Average Attendance",
      value: "94.2%",
      change: "+2.1%",
      trend: "up" as const,
      icon: Calendar,
      description: "This month"
    },
    {
      title: "Academic Performance",
      value: "87.5%",
      change: "-1.3%",
      trend: "down" as const,
      icon: BookOpen,
      description: "Average score"
    },
    {
      title: "Top Performers",
      value: "156",
      change: "+8",
      trend: "up" as const,
      icon: Award,
      description: "Grade A students"
    },
    {
      title: "Attendance Issues",
      value: "23",
      change: "-12",
      trend: "down" as const,
      icon: AlertCircle,
      description: "Students below 80%"
    },
    {
      title: "Perfect Attendance",
      value: "892",
      change: "+45",
      trend: "up" as const,
      icon: CheckCircle,
      description: "100% attendance"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                {stat.change}
              </span>
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function QuickInsights() {
  const insights = [
    {
      title: "Attendance Trend",
      description: "Overall attendance has improved by 2.1% this month",
      type: "positive" as const,
      icon: TrendingUp
    },
    {
      title: "Academic Alert",
      description: "Mathematics scores have dropped by 3.2% in Class 10A",
      type: "warning" as const,
      icon: AlertCircle
    },
    {
      title: "Perfect Attendance",
      description: "72% of students achieved perfect attendance this month",
      type: "positive" as const,
      icon: CheckCircle
    },
    {
      title: "Late Arrivals",
      description: "Late arrivals increased by 15% compared to last month",
      type: "warning" as const,
      icon: AlertCircle
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Insights</CardTitle>
        <CardDescription>
          Key observations and trends from your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
            <div className={`p-2 rounded-full ${
              insight.type === "positive" 
                ? "bg-green-100 text-green-600" 
                : "bg-yellow-100 text-yellow-600"
            }`}>
              <insight.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
            <Badge variant={insight.type === "positive" ? "default" : "secondary"}>
              {insight.type === "positive" ? "Positive" : "Attention"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
