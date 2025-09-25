"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { month: "Jan", present: 95, absent: 5, late: 8 },
  { month: "Feb", present: 92, absent: 8, late: 6 },
  { month: "Mar", present: 88, absent: 12, late: 10 },
  { month: "Apr", present: 94, absent: 6, late: 7 },
  { month: "May", present: 91, absent: 9, late: 9 },
  { month: "Jun", present: 96, absent: 4, late: 5 },
  { month: "Jul", present: 93, absent: 7, late: 8 },
  { month: "Aug", present: 89, absent: 11, late: 12 },
]

const chartConfig = {
  present: {
    label: "Present",
    color: "hsl(var(--chart-1))",
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--chart-2))",
  },
  late: {
    label: "Late",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Attendance Overview</CardTitle>
        <CardDescription>
          Track attendance patterns over the last 8 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="present" fill="var(--color-present)" radius={4} />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={4} />
            <Bar dataKey="late" fill="var(--color-late)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
