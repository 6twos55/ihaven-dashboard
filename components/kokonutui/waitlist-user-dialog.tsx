"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Mail, Phone, MapPin, Globe, Monitor, User, Building } from "lucide-react"
import type { WaitlistUser } from "@/lib/types"

interface WaitlistUserDialogProps {
  user: WaitlistUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function WaitlistUserDialog({ user, open, onOpenChange }: WaitlistUserDialogProps) {
  if (!user) return null

  const getUserDisplayName = () => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim()
    }
    if (user.name) {
      return user.name
    }
    return user.email.split("@")[0]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getLocationDisplay = () => {
    if (user.usersLocation && user.usersLocation !== "unknown, unknown") {
      return user.usersLocation
    }
    if (user.city && user.country) {
      return `${user.city}, ${user.state ? user.state + ", " : ""}${user.country}`
    }
    if (user.country) {
      return user.country
    }
    return "Unknown"
  }

  const getFullAddress = () => {
    const parts = [user.street, user.city, user.state, user.lga, user.country].filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-medium text-lg">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{getUserDisplayName()}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                    {user.email}
                  </a>
                </div>
              </div>

              {user.mobileNumber && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${user.mobileNumber}`} className="text-primary hover:underline">
                      {user.mobileNumber}
                    </a>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">User Type</label>
                <Badge
                  variant={user.cryptoNative ? "default" : "secondary"}
                  className={
                    user.cryptoNative ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""
                  }
                >
                  {user.cryptoNative ? "Crypto Native" : "Traditional User"}
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Joined</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          {user.companyName && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                    <p className="text-sm">{user.companyName}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Location Information */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{getLocationDisplay()}</span>
                </div>
              </div>

              {user.countryCode && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Country Code</label>
                  <Badge variant="outline">{user.countryCode}</Badge>
                </div>
              )}

              {getFullAddress() && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Address</label>
                  <p className="text-sm">{getFullAddress()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Technical Information */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Technical Information
            </h3>
            <div className="space-y-4">
              {user.ipAddress && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{user.ipAddress}</p>
                </div>
              )}

              {user.userBrowserIpAddress && user.userBrowserIpAddress !== user.ipAddress && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Browser IP Address</label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{user.userBrowserIpAddress}</p>
                </div>
              )}

              {user.userAgent && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                  <p className="text-xs bg-muted px-2 py-1 rounded break-all">{user.userAgent}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Timestamps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                <p className="text-sm">{formatDate(user.createdAt)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                <p className="text-sm">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
