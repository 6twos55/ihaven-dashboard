"use client"

import { useState } from "react"
import { Eye, Edit, Trash2, Plus, User, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { togglePackageStatus } from "@/lib/services/package-service"

interface PackageService {
  platform: string
  category: string
}

interface PackageUser {
  _id: string
  avatar: string
  profile: {
    username: string
    firstname: string
    lastname: string
    averageRating: number
  }
  category?: string[]
  isActive: boolean
}

interface Package {
  _id: string
  display: string | null
  service: PackageService[]
  description: string
  price: number
  createdBy: PackageUser
  isEnabled: boolean
}

interface PackagesListProps {
  packages: Package[]
  isLoading?: boolean
  onPackageUpdate?: (packageId: string, updatedPackage: Package) => void
}

export default function PackagesList({ packages = [], isLoading = false, onPackageUpdate }: PackagesListProps) {
  const { toast } = useToast()
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [showPackageDetails, setShowPackageDetails] = useState(false)
  const [updatingPackages, setUpdatingPackages] = useState<Set<string>>(new Set())

  const handleViewPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    setShowPackageDetails(true)
  }

  const handleToggleStatus = async (pkg: Package) => {
    const newStatus = !pkg.isEnabled
    setUpdatingPackages((prev) => new Set(prev).add(pkg._id))

    try {
      const response = await togglePackageStatus(pkg._id, newStatus)

      if (response.success && response.data) {
        // Update the package in the parent component
        if (onPackageUpdate) {
          onPackageUpdate(pkg._id, response.data.data)
        }

        toast({
          title: "Success",
          description: `Package ${newStatus ? "activated" : "deactivated"} successfully`,
        })
      } else {
        throw new Error(response.message || "Failed to update package status")
      }
    } catch (error: any) {
      console.error("Error updating package status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update package status",
        variant: "destructive",
      })
    } finally {
      setUpdatingPackages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(pkg._id)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden"
          >
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30]">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No packages found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">No packages match your search criteria.</p>
        <Link href="/packages/create">
          <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
              {pkg.display ? (
                <Image
                  src={pkg.display || "/placeholder.svg"}
                  alt={pkg.description}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.onerror = null // Prevent infinite error loop
                    target.src = "/placeholder.svg?height=400&width=600&text=Image+Not+Found"
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-600">No Image</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white dark:bg-[#1F1F23] rounded-full px-2 py-1 text-xs font-medium">
                {pkg.service[0]?.platform || "Unknown"}
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    pkg.isEnabled
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {pkg.isEnabled ? "Active" : "Inactive"}
                </div>
              </div>
            </div>

            <div className="p-4">
              {/* Creator information */}
              {pkg.createdBy && (
                <Link
                  href={`/users/${pkg.createdBy._id}`}
                  className="flex items-center mb-3 hover:opacity-80 transition-opacity"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                    <Image
                      src={pkg.createdBy.avatar || "/placeholder.svg?height=32&width=32"}
                      alt={pkg.createdBy.profile.firstname || "Creator"}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {pkg.createdBy.profile.firstname} {pkg.createdBy.profile.lastname}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">@{pkg.createdBy.profile.username}</p>
                  </div>
                </Link>
              )}

              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">{pkg.description}</p>

              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.price.toFixed(2)} USDC</p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  {pkg.isEnabled ? (
                    <Power className="h-4 w-4 text-green-600" />
                  ) : (
                    <PowerOff className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">{pkg.isEnabled ? "Active" : "Inactive"}</span>
                </div>
                <Switch
                  checked={pkg.isEnabled}
                  onCheckedChange={() => handleToggleStatus(pkg)}
                  disabled={updatingPackages.has(pkg._id)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => handleViewPackage(pkg)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Link href={`/packages/edit/${pkg._id}`} className="flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package Details Dialog */}
      <Dialog open={showPackageDetails} onOpenChange={setShowPackageDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Package Details</DialogTitle>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-4">
              <div className="h-64 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {selectedPackage.display ? (
                  <Image
                    src={selectedPackage.display || "/placeholder.svg"}
                    alt={selectedPackage.description}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.onerror = null // Prevent infinite error loop
                      target.src = "/placeholder.svg?height=400&width=600&text=Image+Not+Found"
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-600">No Image</span>
                  </div>
                )}
              </div>

              {/* Status in dialog */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  {selectedPackage.isEnabled ? (
                    <Power className="h-4 w-4 text-green-600" />
                  ) : (
                    <PowerOff className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    Package Status: {selectedPackage.isEnabled ? "Active" : "Inactive"}
                  </span>
                </div>
                <Switch
                  checked={selectedPackage.isEnabled}
                  onCheckedChange={() => handleToggleStatus(selectedPackage)}
                  disabled={updatingPackages.has(selectedPackage._id)}
                />
              </div>

              {/* Creator information in dialog */}
              {selectedPackage.createdBy && (
                <div className="flex items-center justify-between">
                  <Link
                    href={`/users/${selectedPackage.createdBy._id}`}
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={selectedPackage.createdBy.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={selectedPackage.createdBy.profile.firstname || "Creator"}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedPackage.createdBy.profile.firstname} {selectedPackage.createdBy.profile.lastname}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        @{selectedPackage.createdBy.profile.username}
                      </p>
                    </div>
                  </Link>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-xs font-medium">
                    {selectedPackage.service[0]?.platform || "Unknown"} -{" "}
                    {selectedPackage.service[0]?.category || "Unknown"}
                  </div>
                </div>
              )}

              <div className="border-t border-b border-gray-200 dark:border-[#2B2B30] py-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedPackage.description}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedPackage.price.toFixed(2)} USDC
                </p>
                <div className="flex space-x-3">
                  <Link href={`/users/${selectedPackage.createdBy._id}`}>
                    <Button variant="outline" className="flex items-center gap-1 bg-transparent">
                      <User className="h-4 w-4" />
                      View Creator
                    </Button>
                  </Link>
                  <Link href={`/packages/edit/${selectedPackage._id}`}>
                    <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-1">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPackageDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
