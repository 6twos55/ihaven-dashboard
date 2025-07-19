"use server"

import { cookies } from "next/headers"
import apiRequest from "./api"

export async function loginUser(email: string, password: string) {
  try {
    const response = await apiRequest("POST", "/auth/sign-in", { email, password })
    console.log("Login response:", response)

    if (response.success && response.data?.data?.token?.access) {
      // Extract token and expiration from the response
      const token = response.data.data.token.access
      const expiresIn = response.data.data.token.expiresIn || 64800000 // Default to 18 hours if not provided

      console.log("Setting cookies with token and expiration:", { token: token.substring(0, 10) + "...", expiresIn })

      // Store the token in a cookie
      cookies().set("Access", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        // Set an appropriate expiration time
        maxAge: Math.floor(expiresIn / 1000), // Convert milliseconds to seconds for cookie maxAge
      })

      // Store the expiration time separately
      cookies().set("ExpiresIn", expiresIn.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: Math.floor(expiresIn / 1000),
      })

      return {
        success: true,
        message: "Login successful",
      }
    }

    return {
      success: false,
      message: response.message || "Login failed",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An error occurred during login",
    }
  }
}
