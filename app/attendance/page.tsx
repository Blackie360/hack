import { Layout } from "@/components/layout"
import { AttendanceTable } from "@/components/attendance-table"

export default function AttendancePage() {
  return (
    <Layout>
      <div className="p-8">
        <AttendanceTable />
      </div>
    </Layout>
  )
}
