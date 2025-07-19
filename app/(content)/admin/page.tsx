"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Mail, MoreHorizontal, X, Check, Shield } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Mock permission data
interface Permission {
  id: string;
  name: string;
  description: string;
}

const MOCK_PERMISSIONS: Permission[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full access to all features",
  },
  {
    id: "2",
    name: "User Manager",
    description: "Can manage users and profiles",
  },
  {
    id: "3",
    name: "Transaction Manager",
    description: "Can manage transactions and payments",
  },
]

// Mock admin data
interface Admin {
  id: string;
  email: string;
  name: string;
  avatar: string;
  isActive: boolean;
  role: string;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

const MOCK_ADMINS: Admin[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "John Admin",
    avatar: "https://res.cloudinary.com/ddhwvds38/image/upload/v1742466628/uploads/akyikenkhzpprmpjtqhk.png",
    isActive: true,
    role: "Super Admin",
    permissions: ["Super Admin"],
    createdAt: "2025-03-10T10:30:00Z",
    lastLogin: "2025-03-18T14:20:00Z",
  },
  {
    id: "2",
    email: "jane@example.com",
    name: "Jane Manager",
    avatar: "https://res.cloudinary.com/ddhwvds38/image/upload/v1738927461/images/w7cjxnae80rnhns4xvzf.jpg",
    isActive: true,
    role: "User Manager",
    permissions: ["User Manager"],
    createdAt: "2025-03-12T09:15:00Z",
    lastLogin: "2025-03-17T11:45:00Z",
  },
  {
    id: "3",
    email: "robert@example.com",
    name: "Robert Finance",
    avatar: "https://res.cloudinary.com/ddhwvds38/image/upload/v1734279590/images/kfswg0omribwxyornjhl.jpg",
    isActive: false,
    role: "Transaction Manager",
    permissions: ["Transaction Manager"],
    createdAt: "2025-03-14T16:20:00Z",
    lastLogin: "2025-03-15T08:30:00Z",
  },
]

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>(MOCK_ADMINS)
  const [searchTerm, setSearchTerm] = useState("")
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)

  // Form state
  const [formEmail, setFormEmail] = useState("")
  const [formName, setFormName] = useState("")
  const [formPermissions, setFormPermissions] = useState<string[]>([])

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInviteAdmin = () => {
    setFormEmail("")
    setFormName("")
    setFormPermissions([])
    setShowInviteDialog(true)
  }

  const handleViewAdmin = (admin: Admin) => {
    setCurrentAdmin(admin)
    setShowViewDialog(true)
  }

  const handleToggleStatus = (id: string) => {
    setAdmins(admins.map((admin) => (admin.id === id ? { ...admin, isActive: !admin.isActive } : admin)))
  }

  const handleSaveInvite = () => {
    // Create new admin
    const newAdmin: Admin = {
      id: Date.now().toString(),
      email: formEmail,
      name: formName,
      avatar: "/placeholder.svg?height=200&width=200",
      isActive: true,
      role: formPermissions.join(", "),
      permissions: formPermissions,
      createdAt: new Date().toISOString(),
    }
    setAdmins([...admins, newAdmin])
    setShowInviteDialog(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administrators</h1>
        <Button
          onClick={handleInviteAdmin}
          className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Invite Admin
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search admins..."
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
                  Admin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#2B2B30]">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3 relative">
                          <Image
                            src={admin.avatar || "/placeholder.svg"}
                            alt={admin.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                          {admin.isActive && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-[#1F1F23]"></div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{admin.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {admin.role}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          admin.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
                        )}
                      >
                        {admin.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(admin.lastLogin)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          onClick={() => handleViewAdmin(admin)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
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
                            <DropdownMenuItem onClick={() => handleToggleStatus(admin.id)}>
                              {admin.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              Delete Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No administrators found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Admin Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={(open) => {
        if (!open) setShowInviteDialog(false)
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Administrator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permissions">Permissions</Label>
              <Select onValueChange={(value) => setFormPermissions([value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select permissions" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PERMISSIONS.map((permission) => (
                    <SelectItem key={permission.id} value={permission.name}>
                      {permission.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This will determine what actions the admin can perform.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveInvite}
              className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Admin Dialog */}
      <Dialog open={showViewDialog} onOpenChange={(open) => {
        if (!open) setShowViewDialog(false)
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Profile</DialogTitle>
          </DialogHeader>
          {currentAdmin && (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden mb-3 relative">
                  <Image
                    src={currentAdmin.avatar || "/placeholder.svg"}
                    alt={currentAdmin.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                  {currentAdmin.isActive && (
                    <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-[#1F1F23]"></div>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{currentAdmin.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{currentAdmin.email}</p>
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded-full mt-2",
                    currentAdmin.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
                  )}
                >
                  {currentAdmin.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="border-t border-b border-gray-200 dark:border-[#2B2B30] py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{currentAdmin.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{formatDate(currentAdmin.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{formatDate(currentAdmin.lastLogin)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Permissions
                </h4>
                <div className="space-y-2">
                  {currentAdmin.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between space-x-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-1"
                  onClick={() => handleToggleStatus(currentAdmin.id)}
                >
                  {currentAdmin.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button className="flex-1 flex items-center justify-center gap-1 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900">
                  Edit Permissions
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
