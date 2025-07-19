"use client"

import { useState } from "react"
import Layout from "@/components/kokonutui/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, Plus, Edit, Trash2, X } from "lucide-react"

// Define permission types
const PERMISSION_TYPES = [
  "can create transaction",
  "can view transaction",
  "can get transaction",
  "can view platform balance",
  "can swap currency",
  "can get user",
  "can view user profile",
  "can delete user profile",
  "can message user",
  "can update user profile",
  "can create admin",
  "can get admin",
  "can update admin",
  "can delete admin",
  "can create package",
  "can delete package",
  "can update order",
  "can create order",
  "can get order",
  "can delete order",
  "can create payment",
  "can delete payment",
  "can update payment",
  "can get payments",
  "can update feePayer",
  "can get feePayer",
  "can create tran on feePayer",
]

// Mock permission data
interface Permission {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
}

const MOCK_PERMISSIONS: Permission[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full access to all features",
    permissions: PERMISSION_TYPES,
    createdAt: "2025-03-15T10:30:00Z",
  },
  {
    id: "2",
    name: "User Manager",
    description: "Can manage users and profiles",
    permissions: ["can get user", "can view user profile", "can update user profile", "can message user"],
    createdAt: "2025-03-16T14:20:00Z",
  },
  {
    id: "3",
    name: "Transaction Manager",
    description: "Can manage transactions and payments",
    permissions: [
      "can create transaction",
      "can view transaction",
      "can get transaction",
      "can view platform balance",
      "can create payment",
      "can get payments",
    ],
    createdAt: "2025-03-17T09:45:00Z",
  },
]

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>(MOCK_PERMISSIONS)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPermissions, setFormPermissions] = useState<string[]>([])

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreatePermission = () => {
    setFormName("")
    setFormDescription("")
    setFormPermissions([])
    setShowCreateDialog(true)
  }

  const handleEditPermission = (permission: Permission) => {
    setCurrentPermission(permission)
    setFormName(permission.name)
    setFormDescription(permission.description)
    setFormPermissions([...permission.permissions])
    setShowEditDialog(true)
  }

  const handleDeletePermission = (id: string) => {
    setPermissions(permissions.filter((permission) => permission.id !== id))
  }

  const handleSavePermission = () => {
    if (showCreateDialog) {
      // Create new permission
      const newPermission: Permission = {
        id: Date.now().toString(),
        name: formName,
        description: formDescription,
        permissions: formPermissions,
        createdAt: new Date().toISOString(),
      }
      setPermissions([...permissions, newPermission])
      setShowCreateDialog(false)
    } else if (showEditDialog && currentPermission) {
      // Update existing permission
      const updatedPermissions = permissions.map((permission) =>
        permission.id === currentPermission.id
          ? {
              ...permission,
              name: formName,
              description: formDescription,
              permissions: formPermissions,
            }
          : permission,
      )
      setPermissions(updatedPermissions)
      setShowEditDialog(false)
    }
  }

  const togglePermission = (permission: string) => {
    if (formPermissions.includes(permission)) {
      setFormPermissions(formPermissions.filter((p) => p !== permission))
    } else {
      setFormPermissions([...formPermissions, permission])
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permissions</h1>
          <Button
            onClick={handleCreatePermission}
            className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Permission
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search permissions..."
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
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Permissions Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-[#2B2B30]">
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {permission.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {permission.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                          {permission.permissions.length} permissions
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(permission.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => handleEditPermission(permission)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => handleDeletePermission(permission.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No permissions found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Permission Dialog */}
      <Dialog
        open={showCreateDialog || showEditDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false)
            setShowEditDialog(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{showCreateDialog ? "Create Permission" : "Edit Permission"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Permission Name</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., User Manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g., Can manage users and profiles"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="border border-gray-200 dark:border-[#2B2B30] rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {PERMISSION_TYPES.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={formPermissions.includes(permission)}
                        onCheckedChange={() => togglePermission(permission)}
                      />
                      <label
                        htmlFor={permission}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false)
                setShowEditDialog(false)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePermission}
              className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              {showCreateDialog ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
