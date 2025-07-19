import OrdersList from "@/components/kokonutui/orders-list"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 bg-white dark:bg-[#1F1F23] border border-gray-200 dark:border-[#2B2B30] rounded-md text-sm">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="awaiting">Awaiting Approval</option>
          </select>
        </div>
      </div>
      <OrdersList />
    </div>
  )
}
