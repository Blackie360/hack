"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useData } from "@/contexts/data-context"
import { Layout } from "@/components/layout"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"

export default function Home() {
  const { students, classes, users } = useData()
  const router = useRouter()

  useEffect(() => {
    // If no data exists, redirect to welcome page
    if (students.length === 0 && classes.length === 0 && users.length === 0) {
      router.push("/welcome")
    }
  }, [students.length, classes.length, users.length, router])

  // Show loading or redirect if no data
  if (students.length === 0 && classes.length === 0 && users.length === 0) {
    return (
      <Layout>
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-8">
        <EnhancedDashboard />
      </div>
    </Layout>
  )
}
