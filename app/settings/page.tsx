import { Layout } from "@/components/layout"
import { SettingsPage as SettingsPageComponent } from "@/components/settings-page"

export default function SettingsPage() {
  return (
    <Layout>
      <div className="p-8">
        <SettingsPageComponent />
      </div>
    </Layout>
  )
}
