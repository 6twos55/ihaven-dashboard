"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  Building,
  FolderKanban,
  BanknoteIcon,
  Receipt,
  CreditCard,
  FileText,
  Users2,
  Folder,
  Shield,
  MessagesSquare,
  Settings,
  HelpCircle,
  Menu,
  Clock,
  Cog,
} from "lucide-react"

import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: React.ElementType
    children: React.ReactNode
  }) {
    const isActive = pathname === href

    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
          "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]",
          isActive && "bg-gray-100 dark:bg-[#1F1F23] text-gray-900 dark:text-white",
        )}
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    )
  }

  return (
    <>
      {/* MOBILE BURGER BUTTON */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* SIDEBAR */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full flex flex-col">
          {/* LOGO */}
          <Link href="/" className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
            <div className="flex items-center gap-3">
              <Image
                src="https://staging.ihaven.vip/_next/static/media/purpleLogo_whiteText.15530d30.svg"
                alt="I-HAVEN"
                width={100}
                height={40}
                className="flex-shrink-0 block dark:hidden"
              />
              <Image
                src="https://staging.ihaven.vip/_next/static/media/whiteLogo_blackText.e2f6151f.svg"
                alt="I-HAVEN"
                width={100}
                height={40}
                className="flex-shrink-0 hidden dark:block"
              />
            </div>
          </Link>

          {/* NAV GROUPS */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              {/* OVERVIEW */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Overview
                </div>
                <div className="space-y-1">
                  <NavItem href="/dashboard" icon={LayoutDashboard}>
                    Dashboard
                  </NavItem>
                  <NavItem href="/analytics" icon={BarChart3}>
                    Analytics
                  </NavItem>
                  <NavItem href="/fee-payer" icon={Wallet}>
                    Fee Payer
                  </NavItem>
                  <NavItem href="/organization" icon={Building}>
                    Organization
                  </NavItem>
                  <NavItem href="/projects" icon={FolderKanban}>
                    Projects
                  </NavItem>
                </div>
              </div>

              {/* FINANCE */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Finance
                </div>
                <div className="space-y-1">
                  <NavItem href="/transactions" icon={BanknoteIcon}>
                    Transactions
                  </NavItem>
                  <NavItem href="#" icon={Receipt}>
                    Invoices
                  </NavItem>
                  <NavItem href="/payments" icon={CreditCard}>
                    Payments
                  </NavItem>
                  <NavItem href="/orders" icon={FileText}>
                    Orders
                  </NavItem>
                </div>
              </div>

              {/* SERVICE */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Service
                </div>
                <div className="space-y-1">
                  <NavItem href="/users" icon={Users2}>
                    Users
                  </NavItem>
                  <NavItem href="/packages" icon={Folder}>
                    Packages
                  </NavItem>
                  <NavItem href="/blogs" icon={FileText}>
                    Blogs
                  </NavItem>
                  <NavItem href="/waitlist" icon={Clock}>
                    Waitlist
                  </NavItem>
                </div>
              </div>

              {/* ADMINISTRATION */}
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Administration
                </div>
                <div className="space-y-1">
                  <NavItem href="/admin" icon={Users2}>
                    Admins
                  </NavItem>
                  <NavItem href="/permissions" icon={Shield}>
                    Permissions
                  </NavItem>
                  <NavItem href="/chat" icon={MessagesSquare}>
                    Chat
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER LINKS */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="/settings" icon={Settings}>
                Settings
              </NavItem>
              <NavItem href="/platform-settings" icon={Cog}>
                Platform Settings
              </NavItem>
              <NavItem href="/help" icon={HelpCircle}>
                Help
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
