"use client"

import { cn } from "@/lib/utils"
import { ArrowDownLeft, Wallet, SendHorizontal, ArrowRight, CreditCard, RefreshCw } from "lucide-react"
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
  type: "usdc" | "solana"
}

interface FeePayerAccountsProps {
  className?: string
}

// Create accounts for both USDC and SOLANA
const ACCOUNTS: AccountItem[] = [
  {
    id: "1",
    title: "USDC Balance",
    description: "Solana blockchain",
    balance: "8,459.45 USDC",
    type: "usdc",
  },
  {
    id: "2",
    title: "SOLANA Balance",
    description: "Native SOL",
    balance: "125.32 SOL",
    type: "solana",
  },
]

export default function FeePayerAccounts({ className }: FeePayerAccountsProps) {
  const [showWalletDialog, setShowWalletDialog] = useState(false)
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [showTopUpDialog, setShowTopUpDialog] = useState(false)
  const [showSwapDialog, setShowSwapDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sendCurrency, setSendCurrency] = useState<"usdc" | "solana">("usdc")
  const [topUpCurrency, setTopUpCurrency] = useState<"usdc" | "solana">("usdc")
  const [swapDirection, setSwapDirection] = useState<"usdc_to_solana" | "solana_to_usdc">("usdc_to_solana")
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

  const handleSendClick = (type: "usdc" | "solana") => {
    setSendCurrency(type)
    setShowSendDialog(true)
  }

  const handleTopUpClick = (type: "usdc" | "solana") => {
    setTopUpCurrency(type)
    setShowTopUpDialog(true)
  }

  const toggleSwapDirection = () => {
    setSwapDirection(swapDirection === "usdc_to_solana" ? "solana_to_usdc" : "usdc_to_solana")
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
      {/* Accounts List */}
      <div className="p-3">
        <div className="space-y-1">
          {ACCOUNTS.map((account) => (
            <div
              key={account.id}
              className={cn(
                "group flex items-center justify-between",
                "p-3 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
                "border border-zinc-100 dark:border-zinc-800",
                "mb-2",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("p-2 rounded-lg", {
                    "bg-blue-100 dark:bg-blue-900/30": account.type === "usdc",
                    "bg-purple-100 dark:bg-purple-900/30": account.type === "solana",
                  })}
                >
                  {account.type === "usdc" && <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  {account.type === "solana" && <Wallet className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{account.title}</h3>
                  {account.description && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{account.description}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{account.balance}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSendClick("usdc")}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "py-2 px-3 rounded-lg",
                "text-xs font-medium",
                "bg-blue-600 text-white",
                "hover:bg-blue-700",
                "shadow-sm hover:shadow",
                "transition-all duration-200",
              )}
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              <span>Send USDC</span>
            </button>
            <button
              type="button"
              onClick={() => handleTopUpClick("usdc")}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "py-2 px-3 rounded-lg",
                "text-xs font-medium",
                "bg-blue-100 text-blue-800",
                "hover:bg-blue-200",
                "shadow-sm hover:shadow",
                "transition-all duration-200",
              )}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Top-up USDC</span>
            </button>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSendClick("solana")}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "py-2 px-3 rounded-lg",
                "text-xs font-medium",
                "bg-purple-600 text-white",
                "hover:bg-purple-700",
                "shadow-sm hover:shadow",
                "transition-all duration-200",
              )}
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              <span>Send SOL</span>
            </button>
            <button
              type="button"
              onClick={() => handleTopUpClick("solana")}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "py-2 px-3 rounded-lg",
                "text-xs font-medium",
                "bg-purple-100 text-purple-800",
                "hover:bg-purple-200",
                "shadow-sm hover:shadow",
                "transition-all duration-200",
              )}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Top-up SOL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-3 gap-2">
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
            <QrCodeIcon className="w-3.5 h-3.5" />
            <span>Show Address</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSwapDialog(true)}
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
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Swap</span>
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
            <DialogTitle>Your Wallet Address</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-3 rounded-lg mb-4">
              <QrCodeIcon className="w-32 h-32 text-zinc-900" />
            </div>
            <p className="text-sm text-center mb-2">This address works for both USDC and SOLANA</p>
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
            <DialogTitle>Send {sendCurrency === "usdc" ? "USDC" : "SOLANA"}</DialogTitle>
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
              <label className="text-sm font-medium">Amount ({sendCurrency === "usdc" ? "USDC" : "SOL"})</label>
              <input
                type="number"
                className="px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-sm"
                placeholder="0.00"
              />
            </div>
            <Button
              className={cn(
                "w-full text-white",
                sendCurrency === "usdc" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700",
              )}
            >
              Send {sendCurrency === "usdc" ? "USDC" : "SOL"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top-up Dialog */}
      <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy {topUpCurrency === "usdc" ? "USDC" : "SOLANA"} with Credit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Amount ({topUpCurrency === "usdc" ? "USDC" : "SOL"})</label>
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
            <Button
              className={cn(
                "w-full text-white",
                topUpCurrency === "usdc" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700",
              )}
            >
              Purchase {topUpCurrency === "usdc" ? "USDC" : "SOL"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Swap Dialog */}
      <Dialog open={showSwapDialog} onOpenChange={setShowSwapDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Swap Currencies</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">From</label>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "flex-1 px-3 py-2 border rounded-l-md bg-white dark:bg-zinc-800 text-sm flex items-center gap-2",
                      "border-zinc-200 dark:border-zinc-700",
                    )}
                  >
                    {swapDirection === "usdc_to_solana" ? (
                      <>
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span>USDC</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 text-purple-600" />
                        <span>SOLANA</span>
                      </>
                    )}
                  </div>
                  <input
                    type="number"
                    className="flex-1 px-3 py-2 border border-l-0 rounded-r-md bg-white dark:bg-zinc-800 text-sm border-zinc-200 dark:border-zinc-700"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="icon" className="rounded-full" onClick={toggleSwapDirection}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">To</label>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "flex-1 px-3 py-2 border rounded-l-md bg-white dark:bg-zinc-800 text-sm flex items-center gap-2",
                      "border-zinc-200 dark:border-zinc-700",
                    )}
                  >
                    {swapDirection === "usdc_to_solana" ? (
                      <>
                        <Wallet className="h-4 w-4 text-purple-600" />
                        <span>SOLANA</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span>USDC</span>
                      </>
                    )}
                  </div>
                  <input
                    type="number"
                    className="flex-1 px-3 py-2 border border-l-0 rounded-r-md bg-white dark:bg-zinc-800 text-sm border-zinc-200 dark:border-zinc-700"
                    placeholder="0.00"
                    readOnly
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>Exchange Rate</span>
                  <span>{swapDirection === "usdc_to_solana" ? "1 USDC ≈ 0.0148 SOL" : "1 SOL ≈ 67.52 USDC"}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <span>Fee</span>
                  <span>0.5%</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Swap Currencies
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Scanner Component */}
      <QrScanner open={showQrScanner} onClose={() => setShowQrScanner(false)} onScan={handleQrScan} />
    </div>
  )
}
