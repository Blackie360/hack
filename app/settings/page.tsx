import { Layout } from "@/components/layout"

export default function SettingsPage() {
  return (
    <Layout>
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600">
            Configure system settings, manage user accounts, and customize the attendance management system.
          </p>
        </div>
      </div>
    </Layout>
  )
}
