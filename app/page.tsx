import { Layout } from "@/components/layout"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"

export default function Home() {
  return (
    <Layout>
      <div className="p-8">
        <EnhancedDashboard />
      </div>
    </Layout>
  )
}
