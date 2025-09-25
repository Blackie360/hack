"use client"

import { SMSModal } from "@/components/sms-modal"

export default function TestSMSModal() {
  const sampleStudent = {
    id: "student-123",
    firstName: "John",
    lastName: "Doe",
    parentName: "Jane Doe",
    parentPhone: "+254712345678", // Kenyan phone number
    class: "Grade 5A"
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">SMS Modal Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Sample Student</h2>
          <p><strong>Name:</strong> {sampleStudent.firstName} {sampleStudent.lastName}</p>
          <p><strong>Parent:</strong> {sampleStudent.parentName}</p>
          <p><strong>Phone:</strong> {sampleStudent.parentPhone}</p>
          <p><strong>Class:</strong> {sampleStudent.class}</p>
          
          <div className="mt-4">
            <SMSModal
              student={sampleStudent}
              teacherName="Ms. Smith"
            />
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Student without Parent Phone</h2>
          <p><strong>Name:</strong> Jane Smith</p>
          <p><strong>Parent:</strong> John Smith</p>
          <p><strong>Phone:</strong> Not provided</p>
          <p><strong>Class:</strong> Grade 3B</p>
          
          <div className="mt-4">
            <SMSModal
              student={{
                id: "student-456",
                firstName: "Jane",
                lastName: "Smith",
                parentName: "John Smith",
                parentPhone: "",
                class: "Grade 3B"
              }}
              teacherName="Mr. Johnson"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
