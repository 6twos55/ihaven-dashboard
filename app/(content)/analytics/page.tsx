"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { ArrowUp, ArrowDown, Download, Calendar, TrendingUp, Users, CreditCard, ShoppingBag } from "lucide-react"

// Mock data for charts
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 7000 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 8000 },
  { name: "Jul", revenue: 10000 },
  { name: "Aug", revenue: 9000 },
  { name: "Sep", revenue: 11000 },
  { name: "Oct", revenue: 12000 },
  { name: "Nov", revenue: 14000 },
  { name: "Dec", revenue: 16000 },
]

const userActivityData = [
  { name: "Jan", active: 500, new: 200 },
  { name: "Feb", active: 600, new: 250 },
  { name: "Mar", active: 700, new: 300 },
  { name: "Apr", active: 800, new: 350 },
  { name: "May", active: 1000, new: 400 },
  { name: "Jun", active: 1200, new: 450 },
  { name: "Jul", active: 1400, new: 500 },
  { name: "Aug", active: 1600, new: 550 },
  { name: "Sep", active: 1800, new: 600 },
  { name: "Oct", active: 2000, new: 650 },
  { name: "Nov", active: 2200, new: 700 },
  { name: "Dec", active: 2400, new: 750 },
]

const platformData = [
  { name: "YouTube", value: 35 },
  { name: "X", value: 25 },
  { name: "Instagram", value: 20 },
  { name: "TikTok", value: 15 },
  { name: "Other", value: 5 },
]

const PLATFORM_COLORS = ["#FF0000", "#1DA1F2", "#C13584", "#000000", "#8B8B8B"]

const transactionData = [
  { name: "Jan", incoming: 3000, outgoing: 1500 },
  { name: "Feb", incoming: 3500, outgoing: 2000 },
  { name: "Mar", incoming: 4000, outgoing: 2200 },
  { name: "Apr", incoming: 4500, outgoing: 2500 },
  { name: "May", incoming: 5000, outgoing: 2800 },
  { name: "Jun", incoming: 5500, outgoing: 3000 },
  { name: "Jul", incoming: 6000, outgoing: 3200 },
  { name: "Aug", incoming: 6500, outgoing: 3500 },
  { name: "Sep", incoming: 7000, outgoing: 3800 },
  { name: "Oct", incoming: 7500, outgoing: 4000 },
  { name: "Nov", incoming: 8000, outgoing: 4200 },
  { name: "Dec", incoming: 8500, outgoing: 4500 },
]

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  change: string
  icon: any
  trend: "up" | "down"
}) => (
  <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
        <div className="flex items-center mt-2">
          <span
            className={`text-xs font-medium flex items-center ${
              trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {trend === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {change}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
        </div>
      </div>
      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </div>
    </div>
  </div>
)

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<string>("year")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="h-4 w-4 mr-2" />
              {dateRange === "year" ? "Last 12 months" : dateRange === "quarter" ? "Last 3 months" : "Last 30 days"}
            </Button>
          </div>
          <Button className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$156,000" change="12.5%" icon={TrendingUp} trend="up" />
        <StatCard title="Active Users" value="2,420" change="8.2%" icon={Users} trend="up" />
        <StatCard title="Transactions" value="1,893" change="5.1%" icon={CreditCard} trend="up" />
        <StatCard title="Orders" value="452" change="3.2%" icon={ShoppingBag} trend="down" />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-4">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Platform Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">User Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="new" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Revenue Growth</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Total Revenue</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$156,000</span>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12.5%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
            </div>

            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Average Order Value</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$345.20</span>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8.3%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
            </div>

            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Conversion Rate</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">3.2%</span>
                <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400 flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  1.5%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">User Growth</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" name="Active Users" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="new" name="New Users" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Total Users</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">2,420</span>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8.2%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
            </div>

            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">New Users</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">750</span>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12.8%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
            </div>

            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Retention Rate</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">68.5%</span>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  3.2%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction Flow</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="incoming" name="Incoming" fill="#8884d8" />
                <Bar dataKey="outgoing" name="Outgoing" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Total Transactions</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">1,893</span>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  5.1%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
            </div>

            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Average Transaction</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$82.45</span>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  2.8%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
            </div>

            <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
              <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">Success Rate</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">97.3%</span>
                <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  0.5%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">vs previous period</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
