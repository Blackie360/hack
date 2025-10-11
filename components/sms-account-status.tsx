"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle, CheckCircle, DollarSign } from "lucide-react"

export function SMSAccountStatus() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span>SMS Account Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Account Balance Issue Detected</strong><br />
            Your Africa's Talking account has insufficient balance. SMS delivery is currently failing with error code 405.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">To resolve this issue:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Log in to your Africa's Talking account</li>
            <li>Navigate to the billing section</li>
            <li>Add credit to your account</li>
            <li>Verify your account status</li>
          </ol>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://account.africastalking.com/', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Africa's Talking Account
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://account.africastalking.com/apps/sandbox/settings/key', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Check API Keys
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Current Status:</strong> InsufficientBalance (Error 405)</p>
          <p><strong>Phone Numbers Tested:</strong> +254707664812, +254750040841</p>
          <p><strong>Last Error:</strong> SMS delivery failed due to account billing issue</p>
        </div>
      </CardContent>
    </Card>
  )
}
