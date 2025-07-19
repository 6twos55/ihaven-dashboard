"use client"

import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ShoppingCart,
  CreditCard,
  type LucideIcon,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Transaction {
  id: string
  title: string
  amount: string
  type: "incoming" | "outgoing" | "swap"
  currency: "usdc" | "solana"
  icon: LucideIcon
  timestamp: string
  status: "completed" | "pending" | "failed"
}

interface FeePayerTransactionsProps {
  className?: string
}

// Create transactions for both USDC and SOLANA
const TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Fee Payment",
    amount: "12.50 USDC",
    type: "outgoing",
    currency: "usdc",
    icon: CreditCard,
    timestamp: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: "2",
    title: "Received from @user123",
    amount: "45.00 USDC",
    type: "incoming",
    currency: "usdc",
    icon: Wallet,
    timestamp: "Today, 9:00 AM",
    status: "completed",
  },
  {
    id: "3",
    title: "Swap USDC to SOL",
    amount: "100.00 USDC → 1.48 SOL",
    type: "swap",
    currency: "usdc",
    icon: RefreshCw,
    timestamp: "Yesterday",
    status: "completed",
  },
  {
    id: "4",
    title: "Network Fee",
    amount: "0.000005 SOL",
    type: "outgoing",
    currency: "solana",
    icon: ShoppingCart,
    timestamp: "Today, 2:45 PM",
    status: "completed",
  },
  {
    id: "5",
    title: "Received from @crypto_wallet",
    amount: "2.5 SOL",
    type: "incoming",
    currency: "solana",
    icon: Wallet,
    timestamp: "Yesterday",
    status: "completed",
  },
  {
    id: "6",
    title: "Swap SOL to USDC",
    amount: "0.5 SOL → 33.76 USDC",
    type: "swap",
    currency: "solana",
    icon: RefreshCw,
    timestamp: "2 days ago",
    status: "completed",
  },
]

export default function FeePayerTransactions({ className }: FeePayerTransactionsProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredTransactions = TRANSACTIONS.filter((transaction) => {
    if (activeTab === "all") return true
    if (activeTab === "usdc") return transaction.currency === "usdc"
    if (activeTab === "solana") return transaction.currency === "solana"
    return true
  })

  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Transaction History</h2>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-3">
                All
              </TabsTrigger>
              <TabsTrigger value="usdc" className="text-xs px-3">
                USDC
              </TabsTrigger>
              <TabsTrigger value="solana" className="text-xs px-3">
                SOLANA
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="space-y-1">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={cn(
                    "group flex items-center gap-3",
                    "p-2 rounded-lg",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                    "transition-all duration-200",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      transaction.currency === "usdc"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-purple-100 dark:bg-purple-900/30",
                      "border border-zinc-200 dark:border-zinc-700",
                    )}
                  >
                    <transaction.icon
                      className={cn(
                        "w-4 h-4",
                        transaction.currency === "usdc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-purple-600 dark:text-purple-400",
                      )}
                    />
                  </div>

                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{transaction.title}</h3>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{transaction.timestamp}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pl-3">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          transaction.type === "incoming"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : transaction.type === "outgoing"
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400",
                        )}
                      >
                        {transaction.type === "incoming" ? "+" : transaction.type === "outgoing" ? "-" : "↔"}
                        {transaction.amount}
                      </span>
                      {transaction.type === "incoming" ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : transaction.type === "outgoing" ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="usdc" className="mt-0">
            <div className="space-y-1">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={cn(
                    "group flex items-center gap-3",
                    "p-2 rounded-lg",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                    "transition-all duration-200",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      "bg-blue-100 dark:bg-blue-900/30",
                      "border border-zinc-200 dark:border-zinc-700",
                    )}
                  >
                    <transaction.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{transaction.title}</h3>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{transaction.timestamp}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pl-3">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          transaction.type === "incoming"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : transaction.type === "outgoing"
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400",
                        )}
                      >
                        {transaction.type === "incoming" ? "+" : transaction.type === "outgoing" ? "-" : "↔"}
                        {transaction.amount}
                      </span>
                      {transaction.type === "incoming" ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : transaction.type === "outgoing" ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="solana" className="mt-0">
            <div className="space-y-1">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={cn(
                    "group flex items-center gap-3",
                    "p-2 rounded-lg",
                    "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                    "transition-all duration-200",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      "bg-purple-100 dark:bg-purple-900/30",
                      "border border-zinc-200 dark:border-zinc-700",
                    )}
                  >
                    <transaction.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>

                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{transaction.title}</h3>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{transaction.timestamp}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pl-3">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          transaction.type === "incoming"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : transaction.type === "outgoing"
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400",
                        )}
                      >
                        {transaction.type === "incoming" ? "+" : transaction.type === "outgoing" ? "-" : "↔"}
                        {transaction.amount}
                      </span>
                      {transaction.type === "incoming" ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : transaction.type === "outgoing" ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "py-2 px-3 rounded-lg",
            "text-xs font-medium",
            "bg-gradient-to-r from-blue-600 to-purple-600",
            "text-white",
            "hover:from-blue-700 hover:to-purple-700",
            "shadow-sm hover:shadow",
            "transform transition-all duration-200",
            "hover:-translate-y-0.5",
            "active:translate-y-0",
          )}
        >
          <span>View All Transactions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
