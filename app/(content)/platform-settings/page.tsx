"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Save, Settings, Loader2 } from "lucide-react"
import { getPlatformSettings, updatePlatformSettings, type PlatformSettings } from "@/lib/services/settings-service"

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    isWithdrawalEnabled: false,
    isBookingEnabled: false,
    isOrderEnabled: false,
    isPackagesEnabled: false,
    isFaqsEnabled: false,
    isRatingEnabled: true,
    isSaveAndFoldersEnabled: true,
    isUploadEnabled: false,
    isMessageEnabled: false,
    isTwoFactorsEnabled: false,
    isWaitListEnabled: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await getPlatformSettings()
      setSettings(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load platform settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (key: keyof PlatformSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const { _id, __v, ...settingsToUpdate } = settings
      await updatePlatformSettings(settingsToUpdate)
      toast({
        title: "Success",
        description: "Platform settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update platform settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const settingsConfig = [
    {
      key: "isWithdrawalEnabled" as keyof PlatformSettings,
      title: "Withdrawal",
      description: "Allow users to withdraw funds from their accounts",
      category: "Financial",
    },
    {
      key: "isBookingEnabled" as keyof PlatformSettings,
      title: "Booking",
      description: "Enable booking functionality for services",
      category: "Services",
    },
    {
      key: "isOrderEnabled" as keyof PlatformSettings,
      title: "Orders",
      description: "Allow users to place and manage orders",
      category: "Services",
    },
    {
      key: "isPackagesEnabled" as keyof PlatformSettings,
      title: "Packages",
      description: "Enable package management and purchasing",
      category: "Services",
    },
    {
      key: "isFaqsEnabled" as keyof PlatformSettings,
      title: "FAQs",
      description: "Show frequently asked questions section",
      category: "Content",
    },
    {
      key: "isRatingEnabled" as keyof PlatformSettings,
      title: "Rating & Reviews",
      description: "Allow users to rate and review services",
      category: "Content",
    },
    {
      key: "isSaveAndFoldersEnabled" as keyof PlatformSettings,
      title: "Save & Folders",
      description: "Enable save functionality and folder organization",
      category: "Content",
    },
    {
      key: "isUploadEnabled" as keyof PlatformSettings,
      title: "File Upload",
      description: "Allow users to upload files and media",
      category: "Content",
    },
    {
      key: "isMessageEnabled" as keyof PlatformSettings,
      title: "Messaging",
      description: "Enable messaging and communication features",
      category: "Communication",
    },
    {
      key: "isTwoFactorsEnabled" as keyof PlatformSettings,
      title: "Two-Factor Authentication",
      description: "Require two-factor authentication for enhanced security",
      category: "Security",
    },
    {
      key: "isWaitListEnabled" as keyof PlatformSettings,
      title: "Waitlist Features",
      description: "Allow collections of waitlist informations",
      category: "Services",
    },
  ]

  const groupedSettings = settingsConfig.reduce(
    (acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    },
    {} as Record<string, typeof settingsConfig>,
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure platform features and functionality</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure platform features and functionality</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <Card key={category} className="bg-white dark:bg-[#1F1F23] border-gray-200 dark:border-[#2B2B30]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Settings className="h-5 w-5" />
                {category}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Manage {category.toLowerCase()} related features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categorySettings.map((setting, index) => (
                <div key={setting.key}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor={setting.key} className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.title}
                      </Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
                    </div>
                    <Switch
                      id={setting.key}
                      checked={settings[setting.key] as boolean}
                      onCheckedChange={(checked) => handleToggle(setting.key, checked)}
                      disabled={saving}
                    />
                  </div>
                  {index < categorySettings.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
