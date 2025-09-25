"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Save, 
  Send, 
  RefreshCw,
  Download,
  Upload,
  Settings,
  Bell,
  MessageSquare
} from "lucide-react"

export function ButtonTestSuite() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const handleTestAction = async (action: string) => {
    setLoading(true)
    setSuccess(false)
    setError(false)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate random success/failure for testing
      const isSuccess = Math.random() > 0.3
      
      if (isSuccess) {
        setSuccess(true)
        toast.success(`${action} completed successfully!`)
      } else {
        setError(true)
        toast.error(`${action} failed. Please try again.`)
      }
    } catch (err) {
      setError(true)
      toast.error(`${action} failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const resetStates = () => {
    setLoading(false)
    setSuccess(false)
    setError(false)
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Button Functionality Test Suite</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Basic Button Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Button Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="default" onClick={() => toast.success("Default button clicked!")}>
                Default
              </Button>
              <Button variant="secondary" onClick={() => toast.info("Secondary button clicked!")}>
                Secondary
              </Button>
              <Button variant="outline" onClick={() => toast.info("Outline button clicked!")}>
                Outline
              </Button>
              <Button variant="ghost" onClick={() => toast.info("Ghost button clicked!")}>
                Ghost
              </Button>
              <Button variant="destructive" onClick={() => toast.error("Destructive button clicked!")}>
                Destructive
              </Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" onClick={() => toast.info("Small button clicked!")}>
                Small
              </Button>
              <Button size="default" onClick={() => toast.info("Default size clicked!")}>
                Default
              </Button>
              <Button size="lg" onClick={() => toast.info("Large button clicked!")}>
                Large
              </Button>
              <Button size="icon" onClick={() => toast.info("Icon button clicked!")}>
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Buttons with Icons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Buttons with Icons</h3>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => toast.success("Save action triggered!")}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => toast.info("Send action triggered!")}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button variant="secondary" onClick={() => toast.info("Download action triggered!")}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => toast.info("Upload action triggered!")}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          {/* Enhanced Button States */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enhanced Button States</h3>
            <div className="flex flex-wrap gap-4">
              <EnhancedButton 
                loading={loading}
                loadingText="Processing..."
                onClick={() => handleTestAction("Test Action")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Test Action
              </EnhancedButton>
              
              <EnhancedButton 
                success={success}
                variant="outline"
                onClick={() => toast.info("Success state button")}
              >
                Success State
              </EnhancedButton>
              
              <EnhancedButton 
                error={error}
                variant="outline"
                onClick={() => toast.info("Error state button")}
              >
                Error State
              </EnhancedButton>
              
              <Button variant="outline" onClick={resetStates}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset States
              </Button>
            </div>
          </div>

          {/* Disabled States */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Disabled States</h3>
            <div className="flex flex-wrap gap-4">
              <Button disabled onClick={() => toast.info("This won't fire")}>
                Disabled Default
              </Button>
              <Button variant="outline" disabled onClick={() => toast.info("This won't fire")}>
                Disabled Outline
              </Button>
              <Button variant="secondary" disabled onClick={() => toast.info("This won't fire")}>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading Disabled
              </Button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/attendance"}
              >
                Go to Attendance
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/students"}
              >
                Go to Students
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/reports"}
              >
                Go to Reports
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/settings"}
              >
                Go to Settings
              </Button>
            </div>
          </div>

          {/* SMS Test Button */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SMS Integration Test</h3>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => window.location.href = "/test-sms"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Test SMS
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
