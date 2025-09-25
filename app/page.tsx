import { Layout } from "@/components/layout"

export default function Home() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600">
            Welcome to the DPM School Attendance Management System. This is the dashboard where you can view attendance statistics, manage students, and access various administrative functions.
          </p>
        </div>
      </div>
    </Layout>
  )
}
