"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  School,
  Bell,
  Shield,
  Database,
  Users,
  Mail,
  Phone,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

export function SettingsPage() {
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: "DPM School",
    schoolCode: "DPM001",
    address: "123 Education Street, Learning City",
    phone: "+1234567890",
    email: "info@dpmschool.edu",
    website: "www.dpmschool.edu",
    principalName: "Dr. Jane Smith",
    establishedYear: "2010",
    totalStudents: 550,
    totalTeachers: 20,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    attendanceAlerts: true,
    examReminders: true,
    holidayNotices: true,
    parentUpdates: true,
  })

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    dataRetention: "2 years",
    sessionTimeout: "30 minutes",
    maxLoginAttempts: 5,
    passwordPolicy: "strong",
    twoFactorAuth: false,
    maintenanceMode: false,
  })

  const [smsSettings, setSmsSettings] = useState({
    provider: "africas-talking",
    apiKey: "****************",
    username: "dpm_school",
    senderId: "DPMSCHOOL",
    enabled: true,
    costPerSms: 0.05,
  })

  const handleSaveSettings = (category: string) => {
    console.log(`Saving ${category} settings`)
    // Here you would typically send data to your backend
    alert(`${category} settings saved successfully!`)
  }

  const handleResetSettings = (category: string) => {
    console.log(`Resetting ${category} settings`)
    alert(`${category} settings reset to default!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">System Settings</CardTitle>
              <p className="text-gray-600 mt-1">Configure school management system preferences</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>System Online</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-blue-600" />
                <span>Last Updated: 2 hours ago</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="school" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="school" className="flex items-center space-x-2">
            <School className="h-4 w-4" />
            <span>School Info</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>SMS Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* School Information Tab */}
        <TabsContent value="school" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <School className="h-5 w-5" />
                <span>School Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={schoolSettings.schoolName}
                    onChange={(e) => setSchoolSettings({...schoolSettings, schoolName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolCode">School Code</Label>
                  <Input
                    id="schoolCode"
                    value={schoolSettings.schoolCode}
                    onChange={(e) => setSchoolSettings({...schoolSettings, schoolCode: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={schoolSettings.address}
                  onChange={(e) => setSchoolSettings({...schoolSettings, address: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={schoolSettings.phone}
                    onChange={(e) => setSchoolSettings({...schoolSettings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolSettings.email}
                    onChange={(e) => setSchoolSettings({...schoolSettings, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={schoolSettings.website}
                    onChange={(e) => setSchoolSettings({...schoolSettings, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principalName">Principal Name</Label>
                  <Input
                    id="principalName"
                    value={schoolSettings.principalName}
                    onChange={(e) => setSchoolSettings({...schoolSettings, principalName: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => handleResetSettings("School")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("School")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Attendance Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified about attendance issues</p>
                  </div>
                  <Switch
                    checked={notificationSettings.attendanceAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, attendanceAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Exam Reminders</Label>
                    <p className="text-sm text-gray-500">Receive exam schedule reminders</p>
                  </div>
                  <Switch
                    checked={notificationSettings.examReminders}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, examReminders: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Holiday Notices</Label>
                    <p className="text-sm text-gray-500">Get notified about school holidays</p>
                  </div>
                  <Switch
                    checked={notificationSettings.holidayNotices}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, holidayNotices: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Parent Updates</Label>
                    <p className="text-sm text-gray-500">Send updates to parents</p>
                  </div>
                  <Switch
                    checked={notificationSettings.parentUpdates}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, parentUpdates: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => handleResetSettings("Notifications")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("Notifications")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>System Security & Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Auto Backup</Label>
                    <p className="text-sm text-gray-500">Automatically backup data daily</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention Period</Label>
                  <Select value={systemSettings.dataRetention} onValueChange={(value) => setSystemSettings({...systemSettings, dataRetention: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 year">1 Year</SelectItem>
                      <SelectItem value="2 years">2 Years</SelectItem>
                      <SelectItem value="5 years">5 Years</SelectItem>
                      <SelectItem value="10 years">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout</Label>
                  <Select value={systemSettings.sessionTimeout} onValueChange={(value) => setSystemSettings({...systemSettings, sessionTimeout: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15 minutes">15 Minutes</SelectItem>
                      <SelectItem value="30 minutes">30 Minutes</SelectItem>
                      <SelectItem value="1 hour">1 Hour</SelectItem>
                      <SelectItem value="2 hours">2 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={systemSettings.maxLoginAttempts}
                    onChange={(e) => setSystemSettings({...systemSettings, maxLoginAttempts: parseInt(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select value={systemSettings.passwordPolicy} onValueChange={(value) => setSystemSettings({...systemSettings, passwordPolicy: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (6+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, numbers)</SelectItem>
                      <SelectItem value="strong">Strong (8+ chars, numbers, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for all users</p>
                  </div>
                  <Switch
                    checked={systemSettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, twoFactorAuth: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Put system in maintenance mode</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => handleResetSettings("System")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("System")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Settings Tab */}
        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>SMS Integration Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Enable SMS notifications for parents</p>
                  </div>
                  <Switch
                    checked={smsSettings.enabled}
                    onCheckedChange={(checked) => setSmsSettings({...smsSettings, enabled: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">SMS Provider</Label>
                  <Select value={smsSettings.provider} onValueChange={(value) => setSmsSettings({...smsSettings, provider: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africas-talking">Africa's Talking</SelectItem>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={smsSettings.apiKey}
                    onChange={(e) => setSmsSettings({...smsSettings, apiKey: e.target.value})}
                    placeholder="Enter your API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={smsSettings.username}
                    onChange={(e) => setSmsSettings({...smsSettings, username: e.target.value})}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senderId">Sender ID</Label>
                  <Input
                    id="senderId"
                    value={smsSettings.senderId}
                    onChange={(e) => setSmsSettings({...smsSettings, senderId: e.target.value})}
                    placeholder="Enter sender ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPerSms">Cost per SMS (USD)</Label>
                  <Input
                    id="costPerSms"
                    type="number"
                    step="0.01"
                    value={smsSettings.costPerSms}
                    onChange={(e) => setSmsSettings({...smsSettings, costPerSms: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">SMS Configuration</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Make sure your SMS provider credentials are correct. Test messages will be sent to verify the configuration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => handleResetSettings("SMS")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={() => handleSaveSettings("SMS")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
