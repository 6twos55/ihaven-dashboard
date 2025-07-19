"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getUserProfile, getUserPackages, getUserFaqs, getUserReviews } from "@/lib/services/user-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  PackageIcon,
  MessageSquare,
  HelpCircle,
  Wallet,
  CreditCard,
  Users,
  Edit,
  Plus,
  DollarSign,
  TrendingUp,
  Award,
  Shield,
  Check,
} from "lucide-react"

interface UserProfile {
  _id: string
  username: string
  firstname: string
  lastname: string
  email: string
  phoneNumber?: string
  location?: string
  bio?: string
  avatar?: string
  isActive: boolean
  isVerified: boolean
  activeInfluencer: boolean
  activated: boolean
  averageRating: number
  totalReviews: number
  joinedDate: string
  category?: string[]
  wallet?: {
    balance: number
    currency: string
  }
  stats?: {
    totalOrders: number
    completedOrders: number
    totalEarnings: number
    referrals: number
  }
}

interface UserPackage {
  _id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  status: string
  createdAt: string
}

interface Review {
  _id: string
  rating: number
  comment: string
  reviewer: {
    name: string
    avatar?: string
  }
  createdAt: string
}

interface FAQ {
  _id: string
  question: string
  answer: string
  createdAt: string
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId as string
  const { toast } = useToast()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [packages, setPackages] = useState<UserPackage[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showTopUpDialog, setShowTopUpDialog] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState("")

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      // Fetch user profile
      const profileResult = await getUserProfile(userId)
      if (profileResult.success && profileResult.data) {
        setUser(profileResult.data as UserProfile)
      }

      // Fetch user packages
      const packagesResult = await getUserPackages(userId)
      if (packagesResult.success && packagesResult.data) {
        setPackages(packagesResult.data.results || [])
      }

      // Fetch user reviews
      const reviewsResult = await getUserReviews(userId)
      if (reviewsResult.success && reviewsResult.data) {
        setReviews(reviewsResult.data.results || [])
      }

      // Fetch user FAQs
      const faqsResult = await getUserFaqs(userId)
      if (faqsResult.success && faqsResult.data) {
        setFaqs(faqsResult.data.results || [])
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopUp = async () => {
    if (!topUpAmount || Number.parseFloat(topUpAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    try {
      // Implement top-up logic here
      toast({
        title: "Success",
        description: `Successfully topped up $${topUpAmount}`,
      })
      setShowTopUpDialog(false)
      setTopUpAmount("")
      // Refresh user data
      fetchUserData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process top-up",
        variant: "destructive",
      })
    }
  }

  const getUserDisplayName = (user: UserProfile) => {
    if (user.firstname || user.lastname) {
      return `${user.firstname || ""} ${user.lastname || ""}`.trim()
    }
    return user.username || "Unknown User"
  }

  const getInitials = (user: UserProfile) => {
    if (user.firstname) return user.firstname.charAt(0).toUpperCase()
    if (user.username) return user.username.charAt(0).toUpperCase()
    return "?"
  }

  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full overflow-hidden">
              <Image
                src={user.avatar || `/placeholder.svg?height=80&width=80&text=${getInitials(user)}`}
                alt={getUserDisplayName(user)}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
            {user.isActive && (
              <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-[#1F1F23]"></div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getUserDisplayName(user)}</h1>
              {user.isVerified && (
                <Check className="h-5 w-5 text-blue-500 bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full" />
              )}
              {user.activeInfluencer && (
                <Shield className="h-5 w-5 text-purple-500 bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />@{user.username}
              </span>
              <span className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {user.email}
              </span>
              {user.phoneNumber && (
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {user.phoneNumber}
                </span>
              )}
              {user.location && (
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
              {!user.activated && <Badge variant="destructive">Blocked</Badge>}
              {user.category?.map((cat) => (
                <Badge key={cat} variant="outline">
                  {cat}
                </Badge>
              ))}
            </div>

            {user.bio && <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>}

            <div className="flex items-center space-x-4">
              {user.averageRating > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{user.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">({user.totalReviews} reviews)</span>
                </div>
              )}
              <span className="text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {new Date(user.joinedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <PackageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats?.totalOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats?.completedOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${user.stats?.totalEarnings || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Referrals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.stats?.referrals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last login</span>
                    <span className="text-sm font-medium">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profile updated</span>
                    <span className="text-sm font-medium">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">New package created</span>
                    <span className="text-sm font-medium">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Top Rated</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Maintained 4.5+ rating</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <PackageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Package Master</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Created 10+ packages</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Packages</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Package
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <Card key={pkg._id}>
                <CardHeader>
                  <CardTitle className="text-base">{pkg.title}</CardTitle>
                  <Badge variant="outline">{pkg.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{pkg.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      ${pkg.price} {pkg.currency}
                    </span>
                    <Badge variant={pkg.status === "active" ? "default" : "secondary"}>{pkg.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <h3 className="text-lg font-semibold">User Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {review.reviewer.avatar ? (
                        <Image
                          src={review.reviewer.avatar || "/placeholder.svg"}
                          alt={review.reviewer.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-medium">{review.reviewer.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{review.reviewer.name}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add FAQ
            </Button>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq._id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{faq.question}</h4>
                      <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Created {new Date(faq.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Wallet Balance
                  </span>
                  <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Top Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Top Up Wallet</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowTopUpDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleTopUp}>Top Up</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${user.wallet?.balance || 0} {user.wallet?.currency || "USD"}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available balance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-sm font-medium">Package Purchase</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                    </div>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">-$50.00</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-sm font-medium">Referral Bonus</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">+$10.00</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Wallet Top-up</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">+$100.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
