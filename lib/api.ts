"use server"
import { cookies } from "next/headers"
import axios from "axios"

// Define response types for API calls
export interface ApiResponse<T> {
  success: boolean
  status: number
  message?: string
  data: T
}

export interface PaginatedResponse<T> {
  results: T[]
  pagination: {
    totalItems: number
    currentPage: number
    totalPages: number
    pageSize: number
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"

// Helper functions for different HTTP methods
export async function get<T>(path: string, params: Record<string, any> = {}): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams()

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value))
    }
  })

  const queryString = queryParams.toString()
  const url = queryString ? `${path}?${queryString}` : path

  return apiRequest("GET", url)
}

export async function post<T>(path: string, data: Record<string, any> = {}): Promise<ApiResponse<T>> {
  return apiRequest("POST", path, data)
}

export async function patch<T>(path: string, data: Record<string, any> = {}): Promise<ApiResponse<T>> {
  return apiRequest("PATCH", path, data)
}

export async function del<T>(path: string): Promise<ApiResponse<T>> {
  return apiRequest("DELETE", path)
}

// Update the apiRequest function to properly handle the token

// Main API request function
export default async function apiRequest(
  method: HttpMethod,
  path: string,
  data: Record<string, unknown> | null = null,
) {
    const cookie = (await cookies()).get("Access")
    const url = `https://ihaven.vercel.app/v1-admin${path}`

  try {
    console.log("Making API request with token:", cookie?.value ? "Token exists" : "No token")

    // Ensure proper token format with Bearer prefix
    const authHeader = cookie?.value ? `Bearer ${cookie.value}` : undefined

    const headers = {
      "Content-Type": "application/json",
      Origin: "https://staging.ihaven.vip",
      ...(authHeader && { Authorization: authHeader }),
    }

    console.log("Request headers:", headers)

    const response = await axios({
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        Origin: "https://staging.ihaven.vip",
        ...(cookie?.value && { Authorization: `Bearer ${cookie.value}` }),
      },
      data: data ?? undefined,
    })

    // Log the full response for debugging
    console.log("API Response:", {
      status: response.status,
      data: response.data
    })

    return {
      success: true,
      status: response.status,
      data: response.data,
    }
  } catch (error: unknown) {
    console.error("API request error:", error)

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response data:", error.response.data)
        return {
          success: false,
          status: error.response.status,
          message: error.response?.data?.message || error.response?.data?.errorMessage || "Unknown Error",
          data: null,
        }
      }
    }

    return {
      success: false,
      status: 500,
      message: "Server Error",
      data: null,
    }
  }
}
