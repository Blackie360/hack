import { Layout } from "@/components/layout"

export default function AttendancePage() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Take Attendance</h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600">
            Take attendance for your classes. Select a class and mark students as present or absent.
          </p>
        </div>
      </div>
    </Layout>
  )
}
