"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Search, X, ExternalLink, Mail, MessageSquare, MoreHorizontal, Check, User, Shield, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination } from "@/components/ui/pagination"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfile {
  username: string
  firstname: string
  lastname: string
  averageRating: number
}

interface UserItem {
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

interface UsersListProps {
  users: UserItem[]
  pagination: PaginationInfo
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export default function UsersList({ users = [], pagination, onPageChange, isLoading = false }: UsersListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  // Filter users based on search term
  const filteredUsers =
    searchTerm.trim() === ""
      ? users
      : users.filter(
          (user) =>
            (user.profile?.username && user.profile.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.profile?.firstname && user.profile.firstname.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.profile?.lastname && user.profile.lastname.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.category && user.category.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))),
        )

  const handleViewUser = (user: UserItem) => {
    router.push(`/users/${user._id}`)
  }

  const getUserDisplayName = (user: UserItem) => {
    if (!user.profile) return "No Data"
    if (user.profile.firstname || user.profile.lastname) {
      return `${user.profile.firstname || ""} ${user.profile.lastname || ""}`.trim()
    }
    return user.profile.username || "No Name"
  }

  // Generate initials for avatar placeholder
  const getInitials = (user: UserItem) => {
    if (!user.profile) return "?"
    if (user.profile.firstname) return user.profile.firstname.charAt(0).toUpperCase()
    if (user.profile.username) return user.profile.username.charAt(0).toUpperCase()
    return "?"
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name, username, or category..."
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

      <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#2B2B30]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#2B2B30]">
              {isLoading ? (
                // Skeleton loader rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full mr-3" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 relative">
                          <Image
                            src={user.avatar || `/placeholder.svg?height=40&width=40&text=${getInitials(user)}`}
                            alt={getUserDisplayName(user)}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                          {user.isActive && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-[#1F1F23]"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                            {getUserDisplayName(user)}
                            {user.isVerified && (
                              <Check className="h-3.5 w-3.5 text-blue-500 bg-blue-100 dark:bg-blue-900/30 p-0.5 rounded-full" />
                            )}
                            {user.activeInfluencer && (
                              <Shield className="h-3.5 w-3.5 text-purple-500 bg-purple-100 dark:bg-purple-900/30 p-0.5 rounded-full" />
                            )}
                          </div>
                          {user.profile && user.profile.averageRating > 0 ? (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <svg
                                  className="w-3 h-3 text-yellow-400 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                {user.profile.averageRating.toFixed(1)}
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 dark:text-gray-500">No rating</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.profile?.username ? `@${user.profile.username}` : "No username"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.category && user.category.length > 0 ? (
                          user.category.map((cat) => (
                            <span
                              key={cat}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                            >
                              {cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No categories</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={cn(
                            "px-2 py-1 text-xs rounded-full inline-flex items-center w-fit",
                            user.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
                          )}
                        >
                          {user.isActive ? "Online" : "Offline"}
                        </span>
                        {user.activated === false && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 inline-flex items-center w-fit">
                            <Ban className="h-3 w-3 mr-1" />
                            Blocked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={() => handleViewUser(user)}
                        >
                          <User className="h-4 w-4" />
                          <span className="sr-only">View Profile</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="sr-only">Message</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>{user.activated ? "Block Account" : "Unblock Account"}</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">Delete User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden mb-3 relative">
                  <Image
                    src={selectedUser.avatar || `/placeholder.svg?height=96&width=96&text=${getInitials(selectedUser)}`}
                    alt={getUserDisplayName(selectedUser)}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                  {selectedUser.isActive && (
                    <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-[#1F1F23]"></div>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {getUserDisplayName(selectedUser)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUser.profile?.username ? `@${selectedUser.profile.username}` : "No username"}
                </p>
                {selectedUser.profile?.averageRating > 0 ? (
                  <div className="flex items-center mt-1">
                    <span className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      {selectedUser.profile.averageRating.toFixed(1)} Rating
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">No rating</div>
                )}
              </div>

              <div className="border-t border-b border-gray-200 dark:border-[#2B2B30] py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1 flex items-center">
                      {selectedUser.isActive ? (
                        <>
                          <Check className="h-4 w-4 text-green-500 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-gray-400 mr-1" />
                          Inactive
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1 truncate">{selectedUser._id}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedUser.category && selectedUser.category.length > 0 ? (
                        selectedUser.category.map((cat) => (
                          <span
                            key={cat}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                          >
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">No categories</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between space-x-3 pt-2">
                <Button variant="outline" className="flex-1 flex items-center justify-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" className="flex-1 flex items-center justify-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button
                  className="flex-1 flex items-center justify-center gap-1 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                  onClick={() => {
                    setShowUserDetails(false)
                    router.push(`/users/${selectedUser._id}`)
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
