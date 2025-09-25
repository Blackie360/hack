"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, CheckCircle, XCircle } from "lucide-react"
import { SMSService } from "@/lib/sms-service"
import { toast } from "sonner"

export default function TestSMSPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [studentName, setStudentName] = useState("")
  const [attendanceStatus, setAttendanceStatus] = useState<"present" | "absent" | "late" | "excused">("absent")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSendTestSMS = async () => {
    if (!phoneNumber || !studentName) {
      toast.error("Please fill in all fields")
      return
    }

    if (!SMSService.validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid phone number (e.g., +254712345678)")
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const smsData = {
        to: SMSService.formatPhoneNumber(phoneNumber),
        message: "",
        studentName,
        attendanceStatus,
        date: new Date().toLocaleDateString()
      }

      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smsData
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to send SMS. Please check your connection and try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatSampleMessage = () => {
    const statusEmoji = {
      present: '✅',
      absent: '❌',
      late: '⏰',
      excused: '📝'
    };

    const statusText = {
      present: 'PRESENT',
      absent: 'ABSENT',
      late: 'LATE',
      excused: 'EXCUSED'
    };

    const statusMessage = {
      present: 'Your child attended school today.',
      absent: 'Your child was absent from school today. Please contact the school if this was unexpected.',
      late: 'Your child arrived late to school today.',
      excused: 'Your child was excused from school today.'
    };

    const emoji = statusEmoji[attendanceStatus];
    const status = statusText[attendanceStatus];
    const message = statusMessage[attendanceStatus];
    const currentDate = new Date().toLocaleDateString();

    return `${emoji} SCHOOL ATTENDANCE ALERT

Dear Parent/Guardian,

${message}

Student: ${studentName || "Student Name"}
Status: ${status}
Date: ${currentDate}

For any questions, please contact the school office.

Thank you,
School Administration`;
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <span>Test SMS Notification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Parent Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Enter phone number with country code (e.g., +254712345678)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    placeholder="John Doe"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Attendance Status</Label>
                  <Select value={attendanceStatus} onValueChange={(value: any) => setAttendanceStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present ✅</SelectItem>
                      <SelectItem value="absent">Absent ❌</SelectItem>
                      <SelectItem value="late">Late ⏰</SelectItem>
                      <SelectItem value="excused">Excused 📝</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSendTestSMS} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Test SMS
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Message Preview</Label>
                  <div className="p-4 bg-gray-50 rounded-lg border text-sm font-mono whitespace-pre-line">
                    {formatSampleMessage()}
                  </div>
                </div>

                {result && (
                  <div className="space-y-2">
                    <Label>Result</Label>
                    <div className={`p-4 rounded-lg border flex items-center space-x-2 ${
                      result.success 
                        ? "bg-green-50 border-green-200 text-green-800" 
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                      {result.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span>{result.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">1. Mark Attendance</h3>
                <p className="text-sm text-blue-700">
                  Teachers mark students as present, absent, late, or excused in the attendance system.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">2. Automatic Detection</h3>
                <p className="text-sm text-green-700">
                  The system automatically detects all students with parent phone numbers and prepares SMS notifications.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">3. Send SMS</h3>
                <p className="text-sm text-purple-700">
                  Parents receive SMS notifications via Africa's Talking API with attendance details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
