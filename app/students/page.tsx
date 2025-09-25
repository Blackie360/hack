import { Layout } from "@/components/layout"

export default function StudentsPage() {
  return (
    <Layout>
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600">
            View and manage all students in the school. Add new students, edit information, and track attendance records.
          </p>
        </div>
      </div>
    </Layout>
  )
}
