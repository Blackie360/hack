"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const performanceData = [
  { month: "Jan", math: 85, science: 88, english: 82, social: 90 },
  { month: "Feb", math: 87, science: 85, english: 85, social: 88 },
  { month: "Mar", math: 82, science: 90, english: 88, social: 85 },
  { month: "Apr", math: 90, science: 87, english: 90, social: 92 },
  { month: "May", math: 88, science: 92, english: 87, social: 88 },
  { month: "Jun", math: 92, science: 89, english: 92, social: 90 },
]

const chartConfig = {
  math: {
    label: "Mathematics",
    color: "hsl(var(--chart-1))",
  },
  science: {
    label: "Science",
    color: "hsl(var(--chart-2))",
  },
  english: {
    label: "English",
    color: "hsl(var(--chart-3))",
  },
  social: {
    label: "Social Studies",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function AcademicPerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Performance Trends</CardTitle>
        <CardDescription>
          Average scores across subjects over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={performanceData}>
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
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="math"
              stroke="var(--color-math)"
              strokeWidth={2}
              dot={{ fill: "var(--color-math)", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="science"
              stroke="var(--color-science)"
              strokeWidth={2}
              dot={{ fill: "var(--color-science)", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="english"
              stroke="var(--color-english)"
              strokeWidth={2}
              dot={{ fill: "var(--color-english)", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="social"
              stroke="var(--color-social)"
              strokeWidth={2}
              dot={{ fill: "var(--color-social)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
