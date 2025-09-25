"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Download, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function ReportFilters() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<string>("all")
  const [selectedGrade, setSelectedGrade] = useState<string>("all")

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    setSelectedClass("all")
    setSelectedReport("all")
    setSelectedGrade("all")
  }

  const hasActiveFilters = 
    dateRange.from || 
    dateRange.to || 
    (selectedClass && selectedClass !== "all") || 
    (selectedReport && selectedReport !== "all") || 
    (selectedGrade && selectedGrade !== "all")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Report Filters
        </CardTitle>
        <CardDescription>
          Customize your reports with filters and date ranges
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => setDateRange({
                    from: range?.from,
                    to: range?.to,
                  })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Class Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="class-1">Class 1</SelectItem>
                <SelectItem value="class-2">Class 2</SelectItem>
                <SelectItem value="class-3">Class 3</SelectItem>
                <SelectItem value="class-4">Class 4</SelectItem>
                <SelectItem value="class-5">Class 5</SelectItem>
                <SelectItem value="class-6">Class 6</SelectItem>
                <SelectItem value="class-7">Class 7</SelectItem>
                <SelectItem value="class-8">Class 8</SelectItem>
                <SelectItem value="class-9">Class 9</SelectItem>
                <SelectItem value="class-10">Class 10</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grade Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Grade</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="A">Grade A</SelectItem>
                <SelectItem value="B">Grade B</SelectItem>
                <SelectItem value="C">Grade C</SelectItem>
                <SelectItem value="D">Grade D</SelectItem>
                <SelectItem value="F">Grade F</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Report Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="All Reports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="attendance">Attendance Reports</SelectItem>
                <SelectItem value="academic">Academic Reports</SelectItem>
                <SelectItem value="behavioral">Behavioral Reports</SelectItem>
                <SelectItem value="financial">Financial Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            {dateRange.from && (
              <Badge variant="secondary" className="gap-1">
                Date: {format(dateRange.from, "MMM dd")}
                {dateRange.to && ` - ${format(dateRange.to, "MMM dd")}`}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setDateRange({ from: undefined, to: undefined })}
                />
              </Badge>
            )}
            {selectedClass && selectedClass !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Class: {selectedClass}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedClass("all")}
                />
              </Badge>
            )}
            {selectedGrade && selectedGrade !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Grade: {selectedGrade}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedGrade("all")}
                />
              </Badge>
            )}
            {selectedReport && selectedReport !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Report: {selectedReport}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedReport("all")}
                />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        )}

        {/* Export Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button size="sm">
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
