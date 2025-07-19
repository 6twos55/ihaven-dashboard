"use client"

import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownLeft, Wallet, SendHorizontal, QrCode, Plus, ArrowRight, CreditCard } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCodeIcon, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import QrScanner from "./qr-scanner"

interface AccountItem {
  id: string
  title: string
  description?: string
  balance: string
  type: "savings" | "checking" | "investment" | "debt"
}

interface List01Props {
  totalBalance?: string
  accounts?: AccountItem[]
  className?: string
}

// Update the accounts list to use USDC
const ACCOUNTS: AccountItem[] = [
  {
    id: "1",
    title: "Main USDC Wallet",
    description: "Solana blockchain",
    balance: "8,459.45 USDC",
    type: "savings",
  },
  {
    id: "2",
    title: "Trading Account",
    description: "Daily transactions",
    balance: "2,850.00 USDC",
    type: "checking",
  },
  {
    id: "3",
    title: "Investment Portfolio",
    description: "DeFi staking",
    balance: "15,230.80 USDC",
    type: "investment",
  },
  {
    id: "4",
    title: "Credit Card",
    description: "Pending charges",
    balance: "1,200.00 USDC",
    type: "debt",
  },
  {
    id: "5",
    title: "Savings Account",
    description: "Emergency fund",
    balance: "3,000.00 USDC",
    type: "savings",
  },
]

// Update the totalBalance to use USDC
export default function List01({ totalBalance = "26,540.25 USDC", accounts = ACCOUNTS, className }: List01Props) {
  // Add these state variables and functions inside the component before the return statement
  const [showWalletDialog, setShowWalletDialog] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showTopUpDialog, setShowTopUpDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const walletAddress = "8ZmHXpKJJTdMNLPSfgJLBFrFhQJ5zamcKtQJGbki9rKY"

  // Add state for QR scanner
  const [showQrScanner, setShowQrScanner] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState("")

  const showWalletAddress = () => {
    setShowWalletDialog(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Add handler for QR scan result
  const handleQrScan = (result: string) => {
    setRecipientAddress(result)
    setShowQrScanner(false)
  }

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
      {/* Total Balance Section */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Total Balance</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{totalBalance}</h1>
      </div>

      {/* Accounts List */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Your Accounts</h2>
        </div>

        <div className="space-y-1">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={cn(
                "group flex items-center justify-between",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("p-1.5 rounded-lg", {
                    "bg-emerald-100 dark:bg-emerald-900/30": account.type === "savings",
                    "bg-blue-100 dark:bg-blue-900/30": account.type === "checking",
                    "bg-purple-100 dark:bg-purple-900/30": account.type === "investment",
                  })}
                >
                  {account.type === "savings" && (
                    <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {account.type === "checking" && <QrCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  {account.type === "investment" && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  )}
                  {account.type === "debt" && <CreditCard className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
                </div>
                <div>
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{account.title}</h3>
                  {account.description && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{account.description}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{account.balance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Updated footer with four buttons */}
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => showWalletAddress()}
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSendDialog(true)}
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
          <button
            type="button"
            onClick={() => setShowTopUpDialog(true)}
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Top-up</span>
          </button>
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>More</span>
          </button>
        </div>
      </div>
      {/* Wallet Address Dialog */}
      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your USDC Wallet Address</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-3 rounded-lg mb-4">
              <QrCodeIcon className="w-32 h-32 text-zinc-900" />
            </div>
            <div className="flex items-center justify-between w-full p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
              <span className="text-xs text-zinc-700 dark:text-zinc-300 truncate mr-2">{walletAddress}</span>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 px-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send USDC</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Recipient Address</label>
              <div className="flex">
                <input
                  className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-l-md bg-white dark:bg-zinc-800 text-sm"
                  placeholder="Enter Solana wallet address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
                <Button variant="outline" className="rounded-l-none border-l-0" onClick={() => setShowQrScanner(true)}>
                  <QrCodeIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Amount (USDC)</label>
              <input
                type="number"
                className="px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm"
                placeholder="0.00"
              />
            </div>
            <Button className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
              Send USDC
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top-up Dialog */}
      <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy USDC with Credit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Amount (USDC)</label>
              <input
                type="number"
                className="px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm"
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Card Number</label>
              <input
                className="px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <input
                  className="px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm"
                  placeholder="MM/YY"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">CVC</label>
                <input
                  className="px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm"
                  placeholder="123"
                />
              </div>
            </div>
            <Button className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
              Purchase USDC
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* QR Scanner Component */}
      <QrScanner open={showQrScanner} onClose={() => setShowQrScanner(false)} onScan={handleQrScan} />
    </div>
  )
}
