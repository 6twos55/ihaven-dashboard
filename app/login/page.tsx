"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import apiRequest from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Make a real API request instead of using mock data
      const response = await apiRequest("POST", "/auth/sign-in", { email, password })

      console.log("Login response:", response)

      if (response.success && response.data?.data?.token?.access) {
        // Extract token and expiration
        const token = response.data.data.token.access
        const expiresIn = response.data.data.token.expiresIn || 64800000

        // Store token in cookies using document.cookie for client-side
        const currentTime = Date.now()
        document.cookie = `Access=${token}; path=/; max-age=${Math.floor(expiresIn / 1000)}; samesite=strict${process.env.NODE_ENV === "production" ? "; secure" : ""}`
        document.cookie = `ExpiresIn=${expiresIn}; path=/; max-age=${Math.floor(expiresIn / 1000)}; samesite=strict${process.env.NODE_ENV === "production" ? "; secure" : ""}`
        document.cookie = `TokenSetTime=${currentTime}; path=/; max-age=${Math.floor(expiresIn / 1000)}; samesite=strict${process.env.NODE_ENV === "production" ? "; secure" : ""}`

        console.log("Setting cookies with:", {
          token: token.substring(0, 10) + "...",
          expiresIn,
          tokenSetTime: currentTime,
          expiryTime: new Date(currentTime + expiresIn).toISOString(),
        })

        toast({
          title: "Login successful",
          description: "You have been successfully logged in.",
          variant: "default",
        })

        setIsLoading(false)
        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        })
        setError(response.message || "Login failed. Please check your credentials.")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F0F12] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1F1F23] rounded-xl shadow-lg border border-gray-200 dark:border-[#2B2B30] overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <Image
                src="https://staging.ihaven.vip/_next/static/media/purpleLogo_whiteText.15530d30.svg"
                alt="I-HAVEN"
                width={120}
                height={50}
                className="flex-shrink-0 hidden dark:block"
              />
              <Image
                src="https://staging.ihaven.vip/_next/static/media/whiteLogo_blackText.e2f6151f.svg"
                alt="I-HAVEN"
                width={120}
                height={50}
                className="flex-shrink-0 block dark:hidden"
              />
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Sign in to your account
            </h1>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
