import { Layout } from "@/components/layout"
import { ReportFilters } from "@/components/reports/report-filters"
import { ReportSummary, QuickInsights } from "@/components/reports/report-summary"
import { AttendanceChart } from "@/components/reports/attendance-chart"
import { AttendancePieChart } from "@/components/reports/attendance-pie-chart"
import { AcademicPerformanceChart } from "@/components/reports/academic-performance-chart"

export default function ReportsPage() {
  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into student performance, attendance, and academic trends.
          </p>
        </div>

        {/* Report Filters */}
        <ReportFilters />

        {/* Summary Statistics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <ReportSummary />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceChart />
          <AttendancePieChart />
        </div>

        {/* Academic Performance */}
        <AcademicPerformanceChart />

        {/* Quick Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickInsights />
          
          {/* Additional Report Cards */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm">Attendance Rate</h3>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm">Average Grade</h3>
                <p className="text-2xl font-bold text-blue-600">B+</p>
                <p className="text-xs text-muted-foreground">87.5% overall</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Recent Activities</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>New students enrolled</span>
                  <span className="text-green-600">+12</span>
                </div>
                <div className="flex justify-between">
                  <span>Attendance reports generated</span>
                  <span className="text-blue-600">+8</span>
                </div>
                <div className="flex justify-between">
                  <span>Academic reports updated</span>
                  <span className="text-purple-600">+15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
