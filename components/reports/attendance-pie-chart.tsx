"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const pieData = [
  { name: "Present", value: 85, fill: "var(--color-present)" },
  { name: "Absent", value: 10, fill: "var(--color-absent)" },
  { name: "Late", value: 5, fill: "var(--color-late)" },
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

export function AttendancePieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Distribution</CardTitle>
        <CardDescription>
          Current month attendance breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              strokeWidth={2}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
