import { Layout } from "@/components/layout"
import { StudentsTable } from "@/components/students-table"

export default function StudentsPage() {
  return (
    <Layout>
      <div className="p-8">
        <StudentsTable />
      </div>
    </Layout>
  )
}
