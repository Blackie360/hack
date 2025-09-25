import { Layout } from "@/components/layout"

export default function AttendancePage() {
  return (
    <Layout>
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600">
            Take attendance for your classes. Select a class and mark students as present or absent.
          </p>
        </div>
      </div>
    </Layout>
  )
}
