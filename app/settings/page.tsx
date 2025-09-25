import { Layout } from "@/components/layout"

export default function SettingsPage() {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600">
            Configure system settings, manage user accounts, and customize the attendance management system.
          </p>
        </div>
      </div>
    </Layout>
  )
}
