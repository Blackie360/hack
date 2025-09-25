import { Layout } from "@/components/layout"
import { BentoGrid } from "@/components/bento-grid"

export default function Home() {
  return (
    <Layout>
      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">
            Here's what's happening at DPM School today. Monitor attendance, manage students, and track performance.
          </p>
        </div>

        {/* Bento Grid Dashboard */}
        <BentoGrid />
      </div>
    </Layout>
  )
}
