"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import WaitlistList from "@/components/kokonutui/waitlist-list"
import { getWaitlistUsers, exportWaitlistUsers } from "@/lib/services/waitlist-service"
import type { WaitlistUser, PaginationMeta } from "@/lib/types"

export default function WaitlistClientPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<WaitlistUser[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const fetchPage = async (page = 1) => {
    setIsLoading(true)
    const res = await getWaitlistUsers(page, pagination.pageSize)
    if (res.success && res.data) {
      setUsers(res.data.results)
      setPagination(res.data.pagination)
    } else {
      toast({
        title: "Error",
        description: res.error ?? "Could not load waitlist",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExport = async () => {
    setIsExporting(true)
    const res = await exportWaitlistUsers()
    if (res.success && res.data) {
      downloadCSV(res.data)
      toast({ title: "Success", description: "Exported CSV successfully" })
    } else {
      toast({ title: "Error", description: res.error ?? "Export failed", variant: "destructive" })
    }
    setIsExporting(false)
  }

  const downloadCSV = (data: WaitlistUser[]) => {
    const headers = [
      "ID",
      "Email",
      "First Name",
      "Last Name",
      "Name",
      "Company Name",
      "Mobile Number",
      "Street",
      "City",
      "State",
      "LGA",
      "Country",
      "Country Code",
      "Crypto Native",
      "Location",
      "IP Address",
      "User Browser IP",
      "Users Location",
      "User Agent",
      "Created At",
      "Updated At",
    ]

    const csvRows = [
      headers.join(","),
      ...data.map((user) =>
        [
          user._id,
          user.email,
          user.firstName || "",
          user.lastName || "",
          user.name || "",
          user.companyName || "",
          user.mobileNumber || "",
          user.street || "",
          user.city || "",
          user.state || "",
          user.lga || "",
          user.country || "",
          user.countryCode || "",
          user.cryptoNative ? "Yes" : "No",
          user.location || "",
          user.ipAddress || "",
          user.userBrowserIpAddress || "",
          user.usersLocation || "",
          user.userAgent || "",
          user.createdAt,
          user.updatedAt,
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ]

    const csv = csvRows.join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `waitlist-users-${new Date().toISOString().split("T")[0]}.csv`
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Waitlist Management</h1>
        <p className="text-muted-foreground">View and manage users on the waitlist</p>
      </div>

      <WaitlistList
        entries={users}
        pagination={pagination}
        isLoading={isLoading}
        isExporting={isExporting}
        onPageChange={fetchPage}
        onExport={handleExport}
      />
    </main>
  )
}
