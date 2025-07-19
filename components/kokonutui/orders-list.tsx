"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, CheckCircle, Clock, ExternalLink, Eye, FileText, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { ORDERS, type OrderItem } from "@/lib/mock/orders"

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "stage":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    case "awaiting approval":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "payment process":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}

const statusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "stage":
      return Clock
    case "awaiting approval":
      return FileText
    case "payment process":
      return ArrowUpRight
    case "completed":
      return CheckCircle
    default:
      return Clock
  }
}

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr))

export default function OrdersList() {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<OrderItem | null>(null)

  const filtered = ORDERS.filter(
    (o) =>
      o.referenceId.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase()),
  )

  const handleView = (o: OrderItem) => {
    setCurrent(o)
    setOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#2B2B30] rounded-lg bg-white dark:bg-[#1F1F23] text-sm"
          placeholder="Search orders by ID or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* table */}
      <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#2B2B30]">
                {["Order ID", "Service", "Price (USDC)", "Status", "Date", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#2B2B30]">
              {filtered.length ? (
                filtered.map((o) => (
                  <tr key={o.orderId} className="hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {o.referenceId}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 mr-3 overflow-hidden">
                          {o.package.display ? (
                            <Image
                              src={o.package.display || "/placeholder.svg"}
                              alt="Package"
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <FileText className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span>
                          {o.package.service[0].platform} - {o.package.service[0].category}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {o.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit",
                          statusColor(o.status),
                        )}
                      >
                        {React.createElement(statusIcon(o.status), {
                          className: "w-3.5 h-3.5 mr-1",
                        })}
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => handleView(o)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        {o.canMakePayment && (
                          <Button variant="outline" size="sm" className="h-8 bg-transparent">
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No orders found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILS DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {current && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{current.referenceId}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created on {formatDate(current.createdAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium flex items-center",
                      statusColor(current.status),
                    )}
                  >
                    {React.createElement(statusIcon(current.status), {
                      className: "w-3.5 h-3.5 mr-1",
                    })}
                    {current.status}
                  </span>
                </div>

                {/* summary grid */}
                <div className="border-t border-b border-gray-200 dark:border-[#2B2B30] py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Service</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {current.package.service[0].platform} - {current.package.service[0].category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{current.price.toFixed(2)} USDC</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1 capitalize">
                        {current.paymentDetails.paymentStatus}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1 capitalize">
                        {current.paymentDetails.paymentType || "USDC"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* executor / creator */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {current.executor ? "Executor" : "Created By"}
                  </h4>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={
                          current.executor?.avatar ||
                          current.createdBy?.avatar ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {current.executor?.profile.firstname || current.createdBy?.profile.firstname}{" "}
                        {current.executor?.profile.lastname || current.createdBy?.profile.lastname}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Rating:&nbsp;
                        {(
                          current.executor?.profile.averageRating ||
                          current.createdBy?.profile.averageRating ||
                          0
                        ).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* dialog actions */}
              <div className="flex justify-end space-x-3 pt-4">
                {current.canMakePayment && (
                  <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                    Pay Now
                  </Button>
                )}
                <Link href={`/orders/${current.orderId}`} passHref>
                  <Button asChild variant="outline" className="flex items-center gap-1 bg-transparent">
                    <>
                      <ExternalLink className="h-4 w-4" />
                      View Full Details
                    </>
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
