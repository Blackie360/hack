import { Layout } from "@/components/layout"

export default function ReportsPage() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600">
            Generate attendance reports, view statistics, and analyze attendance patterns across different time periods.
          </p>
        </div>
      </div>
    </Layout>
  )
}
