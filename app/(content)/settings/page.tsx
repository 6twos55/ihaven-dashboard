"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, CreditCard, Key, Globe, Moon, Sun, Smartphone, Save } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const { theme, setTheme } = useTheme()

  const [settings, setSettings] = useState({
    email: "admin@example.com",
    name: "John Doe",
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
    language: "english",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    theme: theme || "system",
  })

  const handleChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    handleChange("theme", newTheme)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={settings.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={settings.name} onChange={(e) => handleChange("name", e.target.value)} />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications on your device</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleChange("pushNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive marketing and promotional emails</p>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => handleChange("marketingEmails", checked)}
                />
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleChange("twoFactorAuth", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange("sessionTimeout", e.target.value)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your session will expire after this period of inactivity
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <div className="flex justify-end">
                <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Billing Information</h2>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-[#2B2B30]/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Plan</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Pro Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">$29.99/month</p>
                  </div>
                  <Button variant="outline">Upgrade</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Payment Method</h3>
                <div className="flex items-center space-x-4 p-3 border border-gray-200 dark:border-[#2B2B30] rounded-lg">
                  <CreditCard className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Expires 12/2025</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Edit
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Billing History</Button>
                <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance Settings</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={settings.theme === "light" ? "default" : "outline"}
                    className={`flex items-center justify-center ${settings.theme === "light" ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900" : ""}`}
                    onClick={() => handleThemeChange("light")}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === "dark" ? "default" : "outline"}
                    className={`flex items-center justify-center ${settings.theme === "dark" ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900" : ""}`}
                    onClick={() => handleThemeChange("dark")}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme === "system" ? "default" : "outline"}
                    className={`flex items-center justify-center ${settings.theme === "system" ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900" : ""}`}
                    onClick={() => handleThemeChange("system")}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="w-full p-2 border border-gray-200 dark:border-[#2B2B30] rounded-md bg-white dark:bg-[#1F1F23] text-gray-900 dark:text-white"
                  value={settings.language}
                  onChange={(e) => handleChange("language", e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="japanese">Japanese</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="w-full p-2 border border-gray-200 dark:border-[#2B2B30] rounded-md bg-white dark:bg-[#1F1F23] text-gray-900 dark:text-white"
                  value={settings.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time (EST)</option>
                  <option value="CST">Central Time (CST)</option>
                  <option value="MST">Mountain Time (MST)</option>
                  <option value="PST">Pacific Time (PST)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <select
                  id="date-format"
                  className="w-full p-2 border border-gray-200 dark:border-[#2B2B30] rounded-md bg-white dark:bg-[#1F1F23] text-gray-900 dark:text-white"
                  value={settings.dateFormat}
                  onChange={(e) => handleChange("dateFormat", e.target.value)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
