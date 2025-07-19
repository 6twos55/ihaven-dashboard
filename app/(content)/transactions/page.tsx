"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Search, X, ArrowUpRight, ArrowDownLeft, Filter, Download, Calendar, ChevronDown, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Transaction {
  id: string
  type: "incoming" | "outgoing" | "swap"
  amount: string
  currency: "USDC" | "SOL"
  description: string
  status: "completed" | "pending" | "failed"
  date: string
  time: string
  from?: string
  to?: string
  txHash: string
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-001",
    type: "incoming",
    amount: "500.00",
    currency: "USDC",
    description: "Payment received from @cryptouser",
    status: "completed",
    date: "2025-04-01",
    time: "14:32:45",
    from: "8ZmHXpKJJTdMNLPSfgJLBFrFhQJ5zamcKtQJGbki9rKY",
    to: "3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah4WnKrwQvmKFY",
    txHash: "5UxV52iFY7SDTXx1Swrm9prYNcwp5RPK3K9fYVXnbxpF",
  },
  {
    id: "TX-002",
    type: "outgoing",
    amount: "120.50",
    currency: "USDC",
    description: "Payment for NFT purchase",
    status: "completed",
    date: "2025-04-01",
    time: "10:15:22",
    from: "3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah4WnKrwQvmKFY",
    to: "7YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
    txHash: "2YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
  },
  {
    id: "TX-003",
    type: "swap",
    amount: "50.00 USDC → 0.75 SOL",
    currency: "USDC",
    description: "Currency swap",
    status: "completed",
    date: "2025-03-31",
    time: "18:45:10",
    txHash: "9YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
  },
  {
    id: "TX-004",
    type: "outgoing",
    amount: "0.25",
    currency: "SOL",
    description: "Network fee payment",
    status: "completed",
    date: "2025-03-30",
    time: "09:22:33",
    from: "3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah4WnKrwQvmKFY",
    to: "5UxV52iFY7SDTXx1Swrm9prYNcwp5RPK3K9fYVXnbxpF",
    txHash: "7YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
  },
  {
    id: "TX-005",
    type: "incoming",
    amount: "1000.00",
    currency: "USDC",
    description: "Deposit from exchange",
    status: "completed",
    date: "2025-03-29",
    time: "15:10:45",
    from: "7YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
    to: "3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah4WnKrwQvmKFY",
    txHash: "3YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
  },
  {
    id: "TX-006",
    type: "outgoing",
    amount: "250.00",
    currency: "USDC",
    description: "Payment to @developer",
    status: "pending",
    date: "2025-03-28",
    time: "11:05:30",
    from: "3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah4WnKrwQvmKFY",
    to: "8ZmHXpKJJTdMNLPSfgJLBFrFhQJ5zamcKtQJGbki9rKY",
    txHash: "4YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
  },
  {
    id: "TX-007",
    type: "outgoing",
    amount: "75.25",
    currency: "USDC",
    description: "Subscription payment",
    status: "failed",
    date: "2025-03-27",
    time: "08:30:15",
    from: "3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah4WnKrwQvmKFY",
    to: "5UxV52iFY7SDTXx1Swrm9prYNcwp5RPK3K9fYVXnbxpF",
    txHash: "6YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
  },
  {
    id: "TX-008",
    type: "swap",
    amount: "2.5 SOL → 165.75 USDC",
    currency: "SOL",
    description: "Currency swap",
    status: "completed",
    date: "2025-03-26",
    time: "16:20:40",
    txHash: "8YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
  },
]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        </PaginationItem>
        {/* Display page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    // Search filter
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter

    // Type filter
    const matchesType = typeFilter === "all" || tx.type === typeFilter

    // Date range filter
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const txDate = new Date(tx.date)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = txDate >= startDate && txDate <= endDate
    }

    return matchesSearch && matchesStatus && matchesType && matchesDateRange
  })

  const handleViewTransaction = (tx: Transaction) => {
    setSelectedTransaction(tx)
    setShowTransactionDetails(true)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setDateRange({ start: "", end: "" })
    setStatusFilter("all")
    setTypeFilter("all")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search transactions by ID, description, or amount..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  className="pl-10 w-36"
                  placeholder="Start date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <span className="mx-2 text-gray-500">to</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  className="pl-10 w-36"
                  placeholder="End date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Status
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("failed")}>Failed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Type
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("incoming")}>Incoming</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("outgoing")}>Outgoing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("swap")}>Swap</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(searchTerm || dateRange.start || dateRange.end || statusFilter !== "all" || typeFilter !== "all") && (
              <Button variant="ghost" onClick={handleClearFilters} className="text-gray-500">
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#2B2B30]">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#2B2B30]">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {tx.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {tx.type === "incoming" ? (
                          <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-1" />
                        ) : tx.type === "outgoing" ? (
                          <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
                        ) : (
                          <svg
                            className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                        )}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tx.type === "swap" ? (
                        tx.amount
                      ) : (
                        <>
                          {tx.type === "incoming" ? "+" : "-"}
                          {tx.amount} {tx.currency}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tx.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(tx.date)} {tx.time}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => handleViewTransaction(tx)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No transactions found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <PaginationComponent currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog open={showTransactionDetails} onOpenChange={setShowTransactionDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedTransaction.id}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}
                >
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#2B2B30]/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
                  <div className="flex items-center">
                    {selectedTransaction.type === "incoming" ? (
                      <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-1" />
                    ) : selectedTransaction.type === "outgoing" ? (
                      <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
                    ) : (
                      <svg
                        className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {selectedTransaction.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedTransaction.type === "swap" ? (
                      selectedTransaction.amount
                    ) : (
                      <>
                        {selectedTransaction.type === "incoming" ? "+" : "-"}
                        {selectedTransaction.amount} {selectedTransaction.currency}
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Date & Time</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedTransaction.date)} {selectedTransaction.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Description</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedTransaction.description}
                  </span>
                </div>
              </div>

              {(selectedTransaction.from || selectedTransaction.to) && (
                <div className="space-y-3 pt-2">
                  {selectedTransaction.from && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">From</p>
                      <div className="bg-gray-50 dark:bg-[#2B2B30]/50 p-2 rounded-md">
                        <p className="text-xs text-gray-900 dark:text-white font-mono break-all">
                          {selectedTransaction.from}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedTransaction.to && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">To</p>
                      <div className="bg-gray-50 dark:bg-[#2B2B30]/50 p-2 rounded-md">
                        <p className="text-xs text-gray-900 dark:text-white font-mono break-all">
                          {selectedTransaction.to}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transaction Hash</p>
                <div className="bg-gray-50 dark:bg-[#2B2B30]/50 p-2 rounded-md">
                  <p className="text-xs text-gray-900 dark:text-white font-mono break-all">
                    {selectedTransaction.txHash}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  View on Explorer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
