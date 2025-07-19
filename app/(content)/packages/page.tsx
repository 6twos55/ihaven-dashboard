"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus, X } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { get } from "@/lib/api"
import { Pagination } from "@/components/ui/pagination"
import PackagesList from "@/components/kokonutui/packages-list"

// Define interfaces based on the API response
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

interface PaginationInfo {
  totalItems: number
  currentPage: number
  totalPages: number
  pageSize: number
}

interface PackagesResponse {
  results: Package[]
  pagination: PaginationInfo
}

export default function PackagesPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [platform, setPlatform] = useState<string>("all")

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Prepare query parameters
        const params: Record<string, any> = {
          page: currentPage,
          pageSize: 10,
          includeUser: true, // Add includeUser parameter to get creator details
        }

        // Add platform filter if not "all"
        if (platform !== "all") {
          params.platform = platform
        }

        // Use the get function from lib/api.ts
        const response = await get<{ message: string; data: PackagesResponse }>("/packages", params)

        if (response.success && response.data) {
          setPackages(response.data.data.results)
          setPagination(response.data.data.pagination)
        } else {
          throw new Error(response.message || "Failed to fetch packages")
        }
      } catch (error: any) {
        console.error("Error fetching packages:", error)
        setError(error.message || "Failed to load packages. Please try again later.")
        setPackages([]) // Ensure packages is an empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [currentPage, platform, toast])

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlatform(e.target.value)
    setCurrentPage(1) // Reset to first page when changing filters
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePackageUpdate = (packageId: string, updatedPackage: Package) => {
    setPackages((prevPackages) => prevPackages.map((pkg) => (pkg._id === packageId ? updatedPackage : pkg)))
  }

  // Filter packages based on search term
  const filteredPackages =
    searchTerm.trim() === ""
      ? packages
      : packages.filter(
          (pkg) =>
            pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.service.some(
              (s) =>
                (s.platform && s.platform.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase())),
            ) ||
            (pkg.createdBy?.profile?.firstname &&
              pkg.createdBy.profile.firstname.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (pkg.createdBy?.profile?.lastname &&
              pkg.createdBy.profile.lastname.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (pkg.createdBy?.profile?.username &&
              pkg.createdBy.profile.username.toLowerCase().includes(searchTerm.toLowerCase())),
        )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Packages</h1>
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 bg-white dark:bg-[#1F1F23] border border-gray-200 dark:border-[#2B2B30] rounded-md text-sm"
            value={platform}
            onChange={handlePlatformChange}
          >
            <option value="all">All Platforms</option>
            <option value="Youtube">YouTube</option>
            <option value="X">X</option>
            <option value="Instagram">Instagram</option>
            <option value="Tiktok">TikTok</option>
          </select>
          <Link href="/packages/create">
            <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search packages by description, platform, category, or creator..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#2B2B30] rounded-lg bg-white dark:bg-[#1F1F23] text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      ) : (
        <>
          <PackagesList packages={filteredPackages} isLoading={isLoading} onPackageUpdate={handlePackageUpdate} />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
