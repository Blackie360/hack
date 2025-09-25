"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { CustomSMSMessage } from "@/lib/sms-service"

interface SMSModalProps {
  student: {
    id: string
    firstName: string
    lastName: string
    parentName: string
    parentPhone: string
    class: string
  }
  teacherName: string
  trigger?: React.ReactNode
}

const messageTypes = [
  { value: 'general', label: 'General Message', prefix: '[SCHOOL]' },
  { value: 'attendance', label: 'Attendance Update', prefix: '[ATTENDANCE]' },
  { value: 'behavior', label: 'Behavior Notice', prefix: '[BEHAVIOR]' },
  { value: 'academic', label: 'Academic Update', prefix: '[ACADEMIC]' },
  { value: 'event', label: 'Event Notification', prefix: '[EVENT]' },
  { value: 'emergency', label: 'Emergency Alert', prefix: '[URGENT]' },
]

const messageTemplates = {
  general: "This is a general message from your child's teacher.",
  attendance: "Your child's attendance has been updated. Please check the school portal for details.",
  behavior: "We would like to discuss your child's behavior. Please contact the school office.",
  academic: "Your child's academic progress has been updated. Please review the latest grades.",
  event: "There's an upcoming school event. Please check the school calendar for details.",
  emergency: "This is an emergency notification. Please contact the school immediately.",
}

export function SMSModal({ student, teacherName, trigger }: SMSModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messageType, setMessageType] = useState<string>('general')
  const [customMessage, setCustomMessage] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(student.parentPhone || '')

  const handleSendSMS = async () => {
    if (!phoneNumber.trim()) {
      toast.error("Please enter a valid phone number")
      return
    }

    if (!customMessage.trim()) {
      toast.error("Please enter a message")
      return
    }

    setLoading(true)

    try {
      const smsData: CustomSMSMessage = {
        to: phoneNumber,
        message: customMessage,
        studentName: `${student.firstName} ${student.lastName}`,
        parentName: student.parentName || 'Parent/Guardian',
        teacherName: teacherName,
        messageType: messageType as any
      }

      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customSmsData: smsData }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("SMS sent successfully to parent!")
        setOpen(false)
        setCustomMessage('')
        setMessageType('general')
      } else {
        toast.error(result.message || "Failed to send SMS")
      }
    } catch (error) {
      console.error('Error sending SMS:', error)
      toast.error("Failed to send SMS. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = (type: string) => {
    setMessageType(type)
    setCustomMessage(messageTemplates[type as keyof typeof messageTemplates])
  }

  const selectedType = messageTypes.find(type => type.value === messageType)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send SMS
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send SMS to Parent
          </DialogTitle>
          <DialogDescription>
            Send a message to {student.parentName || 'the parent'} about {student.firstName} {student.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Info */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{student.firstName} {student.lastName}</p>
                <p className="text-sm text-muted-foreground">Class: {student.class}</p>
              </div>
              <Badge variant="outline">{student.parentName}</Badge>
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Parent Phone Number</Label>
            <Input
              id="phone"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Message Type */}
          <div className="space-y-2">
            <Label>Message Type</Label>
            <Select value={messageType} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                {messageTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-muted px-1 rounded">{type.prefix}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Character count: {customMessage.length}/160
            </p>
          </div>

          {/* Preview */}
          {customMessage && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Message Preview:</p>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedType?.prefix} {selectedType?.label.toUpperCase()}
                {'\n\n'}
                Dear {student.parentName || 'Parent/Guardian'},
                {'\n\n'}
                {customMessage}
                {'\n\n'}
                Student: {student.firstName} {student.lastName}
                From: {teacherName}
                {'\n\n'}
                For any questions, please contact the school office.
                {'\n\n'}
                Thank you,
                School Administration
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendSMS} 
            disabled={loading || !customMessage.trim() || !phoneNumber.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send SMS
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
