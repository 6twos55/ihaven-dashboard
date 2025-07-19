"use client"

import { useState, useEffect } from "react"
import UsersList from "@/components/kokonutui/users-list"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { get } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface UserProfile {
  username: string
  firstname: string
  lastname: string
  averageRating: number
  mobileNumber: string
  gender: string
}

interface User {
  _id: string
  avatar: string | null
  isActive: boolean
  activeInfluencer: boolean
  activated: boolean
  isVerified: boolean
  profile: UserProfile
  category?: string[]
}

interface PaginationInfo {
  totalItems: number
  currentPage: number
  totalPages: number
  pageSize: number
}

interface UsersResponse {
  results: User[]
  pagination: PaginationInfo
}

// Define available categories for filtering
const AVAILABLE_CATEGORIES = [
  "Crypto",
  "Finance",
  "Technology",
  "Marketing",
  "Design",
  "Development",
  "Education",
  "Entertainment",
]

export default function UsersPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  })

  // Filter states
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [filters, setFilters] = useState({
    useCase: "",
    activeInfluencer: false,
    isVerified: false,
    isActive: false,
    category: "",
  })

  const fetchUsers = async (page = 1) => {
    setIsLoading(true)
    try {
      // Check if we have a token in cookies
      const hasToken = document.cookie.includes("Access=")
      if (!hasToken) {
        console.error("No authentication token found")
        toast({
          title: "Authentication Error",
          description: "You need to log in to access this page",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      // Prepare query parameters with filters
      const params: Record<string, any> = { page }

      // Add filters to params
      if (filters.useCase) params.useCase = filters.useCase
      if (filters.activeInfluencer) params.activeInfluencer = filters.activeInfluencer
      if (filters.isVerified) params.isVerified = filters.isVerified
      if (filters.isActive) params.isActive = filters.isActive
      if (filters.category) params.category = filters.category

      // Use the get function from lib/api.ts instead of fetch
      const response = await get<{ message: string; data: UsersResponse }>("/users", params)

      // Check if the response indicates authentication issues
      if (
        response.data?.message === "No Token Provided" ||
        response.data?.message?.includes("authentication") ||
        response.data?.message?.includes("token")
      ) {
        console.error("Authentication issue detected:", response.data.message)
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        })

        // Clear cookies and redirect to login
        document.cookie = "Access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "ExpiresIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.push("/login")
        return
      }

      if (response.success && response.data) {
        setUsers(response.data.data.results)
        setPagination(response.data.data.pagination)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [toast, router, filters])

  const handlePageChange = (page: number) => {
    fetchUsers(page)
  }

  // Update filters and track active filters
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))

    // Update active filters list for display
    if (value && !activeFilters.includes(key)) {
      setActiveFilters((prev) => [...prev, key])
    } else if (!value && activeFilters.includes(key)) {
      setActiveFilters((prev) => prev.filter((filter) => filter !== key))
    }
  }

  // Clear a specific filter
  const clearFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: key === "category" ? "" : false }))
    setActiveFilters((prev) => prev.filter((filter) => filter !== key))
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      useCase: "",
      activeInfluencer: false,
      isVerified: false,
      isActive: false,
      category: "",
    })
    setActiveFilters([])
  }

  // Get display name for filter
  const getFilterDisplayName = (key: string) => {
    switch (key) {
      case "useCase":
        return `Use Case: ${filters.useCase}`
      case "activeInfluencer":
        return "Influencers Only"
      case "isVerified":
        return "Verified Only"
      case "isActive":
        return "Active Only"
      case "category":
        return `Category: ${filters.category}`
      default:
        return key
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>

        {/* Filter dropdown */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Use Case filter */}
              <DropdownMenuLabel className="text-xs text-muted-foreground">Use Case</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.useCase === "creator"}
                onCheckedChange={() => updateFilter("useCase", filters.useCase === "creator" ? "" : "creator")}
              >
                Creator
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.useCase === "client"}
                onCheckedChange={() => updateFilter("useCase", filters.useCase === "client" ? "" : "client")}
              >
                Client
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              {/* Status filters */}
              <DropdownMenuLabel className="text-xs text-muted-foreground">Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.activeInfluencer}
                onCheckedChange={(checked) => updateFilter("activeInfluencer", checked)}
              >
                Influencers Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.isVerified}
                onCheckedChange={(checked) => updateFilter("isVerified", checked)}
              >
                Verified Only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.isActive}
                onCheckedChange={(checked) => updateFilter("isActive", checked)}
              >
                Active Only
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              {/* Category filter */}
              <DropdownMenuLabel className="text-xs text-muted-foreground">Category</DropdownMenuLabel>
              {AVAILABLE_CATEGORIES.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={filters.category === category}
                  onCheckedChange={() => updateFilter("category", filters.category === category ? "" : category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {getFilterDisplayName(filter)}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter(filter)} />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Clear all
          </Button>
        </div>
      )}

      <UsersList users={users} pagination={pagination} onPageChange={handlePageChange} isLoading={isLoading} />
    </div>
  )
}
