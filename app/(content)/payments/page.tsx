"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import {
  Search,
  X,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  Eye,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Payment {
  id: string
  type: "subscription" | "one-time" | "refund"
  amount: string
  currency: "USDC" | "SOL" | "USD"
  description: string
  status: "successful" | "pending" | "failed"
  date: string
  paymentMethod: "credit_card" | "crypto" | "bank_transfer"
  cardDetails?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
  walletAddress?: string
  invoiceId?: string
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: "PAY-001",
    type: "subscription",
    amount: "99.00",
    currency: "USD",
    description: "Enterprise Plan - Monthly",
    status: "successful",
    date: "2025-04-01",
    paymentMethod: "credit_card",
    cardDetails: {
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
    },
    invoiceId: "INV-001",
  },
  {
    id: "PAY-002",
    type: "one-time",
    amount: "500.00",
    currency: "USDC",
    description: "Service Package Purchase",
    status: "successful",
    date: "2025-03-28",
    paymentMethod: "crypto",
    walletAddress: "8ZmHXpKJJTdMNLPSfgJLBFrFhQJ5zamcKtQJGbki9rKY",
    invoiceId: "INV-002",
  },
  {
    id: "PAY-003",
    type: "subscription",
    amount: "99.00",
    currency: "USD",
    description: "Enterprise Plan - Monthly",
    status: "successful",
    date: "2025-03-01",
    paymentMethod: "credit_card",
    cardDetails: {
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
    },
    invoiceId: "INV-003",
  },
  {
    id: "PAY-004",
    type: "one-time",
    amount: "250.00",
    currency: "USDC",
    description: "Custom Development",
    status: "pending",
    date: "2025-03-25",
    paymentMethod: "crypto",
    walletAddress: "3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah4WnKrwQvmKFY",
    invoiceId: "INV-004",
  },
  {
    id: "PAY-005",
    type: "refund",
    amount: "75.00",
    currency: "USD",
    description: "Partial Refund - Service Cancellation",
    status: "successful",
    date: "2025-03-20",
    paymentMethod: "credit_card",
    cardDetails: {
      brand: "mastercard",
      last4: "8888",
      expMonth: 10,
      expYear: 2026,
    },
    invoiceId: "INV-005",
  },
  {
    id: "PAY-006",
    type: "subscription",
    amount: "49.00",
    currency: "USD",
    description: "Professional Plan - Monthly",
    status: "failed",
    date: "2025-03-15",
    paymentMethod: "credit_card",
    cardDetails: {
      brand: "amex",
      last4: "1234",
      expMonth: 8,
      expYear: 2024,
    },
    invoiceId: "INV-006",
  },
  {
    id: "PAY-007",
    type: "one-time",
    amount: "1000.00",
    currency: "USDC",
    description: "Premium Package Purchase",
    status: "successful",
    date: "2025-03-10",
    paymentMethod: "crypto",
    walletAddress: "7YHmVSHx8MxnX3Zj6FJ9VQyHcZWxTMHwXrUEHcnqrQHah",
    invoiceId: "INV-007",
  },
  {
    id: "PAY-008",
    type: "subscription",
    amount: "99.00",
    currency: "USD",
    description: "Enterprise Plan - Monthly",
    status: "successful",
    date: "2025-02-01",
    paymentMethod: "credit_card",
    cardDetails: {
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
    },
    invoiceId: "INV-008",
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
    case "successful":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "successful":
      return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
    case "pending":
      return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
    default:
      return null
  }
}

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "credit_card":
      return <CreditCard className="h-4 w-4" />
    case "crypto":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 9.5L14.5 14.5M14.5 9.5L9.5 14.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "bank_transfer":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 21H21M3 10H21M5 6L12 3L19 6M4 10V21M20 10V21M8 14V17M12 14V17M16 14V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    default:
      return null
  }
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredPayments = MOCK_PAYMENTS.filter((payment) => {
    // Search filter
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    // Type filter
    const matchesType = typeFilter === "all" || payment.type === typeFilter

    // Date range filter
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const paymentDate = new Date(payment.date)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = paymentDate >= startDate && paymentDate <= endDate
    }

    return matchesSearch && matchesStatus && matchesType && matchesDateRange
  })

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowPaymentDetails(true)
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
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
              placeholder="Search payments by ID, description, or amount..."
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
                <DropdownMenuItem onClick={() => setStatusFilter("successful")}>Successful</DropdownMenuItem>
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
                <DropdownMenuItem onClick={() => setTypeFilter("subscription")}>Subscription</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("one-time")}>One-time</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("refund")}>Refund</DropdownMenuItem>
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
                  Payment ID
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
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#2B2B30]">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {payment.type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {payment.amount} {payment.currency}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payment.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(payment.status)}`}
                      >
                        {getStatusIcon(payment.status)}
                        <span className="ml-1 capitalize">{payment.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="ml-1 capitalize">{payment.paymentMethod.replace("_", " ")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => handleViewPayment(payment)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No payments found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Payment Details Dialog */}
      <Dialog open={showPaymentDetails} onOpenChange={setShowPaymentDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedPayment.id}</h3>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusColor(selectedPayment.status)}`}
                >
                  {getStatusIcon(selectedPayment.status)}
                  <span className="ml-1 capitalize">{selectedPayment.status}</span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#2B2B30]/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {selectedPayment.type}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedPayment.amount} {selectedPayment.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedPayment.date)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Description</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedPayment.description}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                  <div className="bg-gray-50 dark:bg-[#2B2B30]/50 p-3 rounded-md">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {selectedPayment.paymentMethod.replace("_", " ")}
                      </span>
                    </div>

                    {selectedPayment.cardDetails && (
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p className="capitalize">
                          {selectedPayment.cardDetails.brand} •••• {selectedPayment.cardDetails.last4}
                        </p>
                        <p>
                          Expires {selectedPayment.cardDetails.expMonth}/{selectedPayment.cardDetails.expYear}
                        </p>
                      </div>
                    )}

                    {selectedPayment.walletAddress && (
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <p className="font-mono break-all">{selectedPayment.walletAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedPayment.invoiceId && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Invoice</p>
                  <div className="bg-gray-50 dark:bg-[#2B2B30]/50 p-3 rounded-md flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedPayment.invoiceId}
                    </span>
                    <Button variant="outline" size="sm" className="h-8">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  View Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
