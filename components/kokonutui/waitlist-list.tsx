"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import WaitlistUserDialog from "./waitlist-user-dialog"
import type { WaitlistUser, PaginationMeta } from "@/lib/types"
import { ChevronLeft, ChevronRight, FileDown, Eye } from "lucide-react"

interface Props {
  entries: WaitlistUser[]
  pagination: PaginationMeta
  isLoading: boolean
  isExporting: boolean
  onPageChange(page: number): void
  onExport(): void
}

export default function WaitlistList({ entries, pagination, isLoading, isExporting, onPageChange, onExport }: Props) {
  const [selectedUser, setSelectedUser] = useState<WaitlistUser | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleRowClick = (user: WaitlistUser) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const getUserDisplayName = (user: WaitlistUser) => {
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
      month: "short",
      day: "numeric",
    })
  }

  const getLocationDisplay = (user: WaitlistUser) => {
    if (user.usersLocation && user.usersLocation !== "unknown, unknown") {
      return user.usersLocation
    }
    if (user.city && user.country) {
      return `${user.city}, ${user.country}`
    }
    if (user.country) {
      return user.country
    }
    return "Unknown"
  }

  const rows = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-6 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-8" />
          </TableCell>
        </TableRow>
      ))
    }

    if (!entries.length) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
            No waitlist users found.
          </TableCell>
        </TableRow>
      )
    }

    return entries.map((user) => (
      <TableRow
        key={user._id}
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => handleRowClick(user)}
      >
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-medium text-xs">
              {getUserDisplayName(user).charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{getUserDisplayName(user)}</div>
              {user.companyName && <div className="text-xs text-muted-foreground">{user.companyName}</div>}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="max-w-[200px] truncate">{user.email}</div>
        </TableCell>
        <TableCell>
          <Badge
            variant={user.cryptoNative ? "default" : "secondary"}
            className={user.cryptoNative ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}
          >
            {user.cryptoNative ? "Crypto" : "Traditional"}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="max-w-[150px] truncate">{getLocationDisplay(user)}</div>
        </TableCell>
        <TableCell className="whitespace-nowrap">{formatDate(user.createdAt)}</TableCell>
        <TableCell>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleRowClick(user)
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View details</span>
          </Button>
        </TableCell>
      </TableRow>
    ))
  }, [entries, isLoading])

  return (
    <>
      <div className="border rounded-lg">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg font-semibold">Waitlist Users</h2>
            <p className="text-sm text-muted-foreground">
              {pagination.totalItems} total users • Click any row to view details
            </p>
          </div>
          <Button size="sm" onClick={onExport} disabled={isExporting} variant="secondary" className="gap-2">
            <FileDown className="h-4 w-4" />
            {isExporting ? "Exporting…" : "Export CSV"}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{rows}</TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages} • Showing {entries.length} of{" "}
            {pagination.totalItems} users
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <WaitlistUserDialog user={selectedUser} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
