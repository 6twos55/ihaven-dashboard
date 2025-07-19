import React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight, CheckCircle, Clock, FileText, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ORDERS } from "@/lib/mock/orders"

interface Props {
  params: { orderId: string }
}

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

const formatDate = (d: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(d))

export default function OrderDetailPage({ params }: Props) {
  const order = ORDERS.find((o) => o.orderId === params.orderId)

  if (!order) return notFound()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{order.referenceId}</h1>
          <p className="text-sm text-gray-500">Created&nbsp;{formatDate(order.createdAt)}</p>
        </div>
        <span className={cn("px-3 py-1 rounded-full text-sm font-medium flex items-center", statusColor(order.status))}>
          {React.createElement(statusIcon(order.status), {
            className: "w-4 h-4 mr-1",
          })}
          {order.status}
        </span>
      </div>

      {/* main grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* left column */}
        <section className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="font-medium mb-2">Service</h2>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {order.package.display ? (
                  <Image
                    src={order.package.display || "/placeholder.svg"}
                    alt="Package"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {order.package.service[0].platform} - {order.package.service[0].category}
                </p>
                <p className="text-sm text-gray-500">{order.price.toFixed(2)} USDC</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-medium mb-2">Payment Details</h2>
            <ul className="text-sm space-y-1">
              <li>
                Status:&nbsp;
                <span className="font-medium capitalize">{order.paymentDetails.paymentStatus}</span>
              </li>
              <li>
                Paid:&nbsp;
                <span className="font-medium">{order.paymentDetails.paid ? "Yes" : "No"}</span>
              </li>
              <li>
                Method:&nbsp;
                <span className="font-medium capitalize">{order.paymentDetails.paymentType || "USDC"}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* right column */}
        <section className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="font-medium mb-2">{order.executor ? "Executor" : "Created By"}</h2>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden mr-3">
                <Image
                  src={order.executor?.avatar || order.createdBy?.avatar || "/placeholder.svg" || "/placeholder.svg"}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">
                  {order.executor?.profile.firstname || order.createdBy?.profile.firstname}{" "}
                  {order.executor?.profile.lastname || order.createdBy?.profile.lastname}
                </p>
                <p className="text-sm text-gray-500">
                  Rating:&nbsp;
                  {(order.executor?.profile.averageRating || order.createdBy?.profile.averageRating || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {order.canMakePayment && <Button className="w-full">Pay Now</Button>}
        </section>
      </div>
    </div>
  )
}
