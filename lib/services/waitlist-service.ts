import type { WaitlistUser, WaitlistApiResponse } from "@/lib/types"

interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function getWaitlistUsers(page = 1, pageSize = 10): Promise<ServiceResponse<WaitlistApiResponse["data"]>> {
  try {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const mockData: WaitlistUser[] = [
      {
        _id: "68625c676f1c891eb95f535c",
        email: "samuelmeshach055@gmail.com",
        firstName: "Samuel",
        lastName: "Meshach",
        cryptoNative: true,
        location: "44.221.75.182",
        ipAddress: "127.0.0.1",
        userBrowserIpAddress: "105.113.68.53",
        usersLocation: "Lagos, NG",
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.6 Mobile/15E148 Safari/604.1",
        createdAt: "2025-06-30T09:44:07.953Z",
        updatedAt: "2025-06-30T09:44:07.953Z",
        __v: 0,
      },
      {
        _id: "686257a4068a55a622336986",
        email: "dsds@gmail.com",
        firstName: "norm",
        lastName: "doe",
        cryptoNative: false,
        location: "105.113.68.53",
        ipAddress: "127.0.0.1",
        userBrowserIpAddress: "::ffff:127.0.0.1",
        usersLocation: "unknown, unknown",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:139.0) Gecko/20100101 Firefox/139.0",
        createdAt: "2025-06-30T09:23:48.644Z",
        updatedAt: "2025-06-30T09:23:48.644Z",
        __v: 0,
      },
      {
        _id: "6862554f0112aebf6d104917",
        email: "sammeshach16@gmail.com",
        firstName: "meshach",
        lastName: "samuel",
        cryptoNative: true,
        location: "105.113.68.53",
        ipAddress: "127.0.0.1",
        userBrowserIpAddress: "::ffff:127.0.0.1",
        usersLocation: "unknown, unknown",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:139.0) Gecko/20100101 Firefox/139.0",
        createdAt: "2025-06-30T09:13:51.924Z",
        updatedAt: "2025-06-30T09:13:51.924Z",
        __v: 0,
      },
      {
        _id: "686251e3480464e98ebceaf9",
        email: "admin@mail.com",
        firstName: "gabriel",
        lastName: "james",
        cryptoNative: true,
        location: "105.113.68.53",
        ipAddress: "127.0.0.1",
        userBrowserIpAddress: "::ffff:127.0.0.1",
        usersLocation: "unknown, unknown",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:139.0) Gecko/20100101 Firefox/139.0",
        createdAt: "2025-06-30T08:59:15.994Z",
        updatedAt: "2025-06-30T08:59:15.994Z",
        __v: 0,
      },
      {
        _id: "6861a040f240e528b0247fcd",
        email: "user2@example.com",
        firstName: "John",
        lastName: "Doe",
        cryptoNative: true,
        location: "::1",
        ipAddress: "::1",
        createdAt: "2025-06-29T20:21:20.088Z",
        updatedAt: "2025-06-29T20:21:20.088Z",
        __v: 0,
      },
      {
        _id: "68619ffce63fc5b17d0bcf9d",
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
        cryptoNative: true,
        location: "::1",
        ipAddress: "::1",
        createdAt: "2025-06-29T20:20:12.738Z",
        updatedAt: "2025-06-29T20:20:12.738Z",
        __v: 0,
      },
      {
        _id: "66d479ec0659721bf1eaa82a",
        name: "Jet Inc",
        companyName: "Jet Org",
        email: "jet@mail.com",
        mobileNumber: "08123456789",
        street: "Jet Street",
        city: "Jet city",
        state: "Jet State",
        lga: "Jet LGA",
        country: "Nigeria",
        countryCode: "NG",
        cryptoNative: false,
        createdAt: "2024-09-01T14:27:56.492Z",
        updatedAt: "2024-09-01T14:27:56.492Z",
        __v: 0,
      },
    ]

    // Simulate pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = mockData.slice(startIndex, endIndex)

    const response = {
      results: paginatedData,
      pagination: {
        totalItems: mockData.length,
        currentPage: page,
        totalPages: Math.ceil(mockData.length / pageSize),
        pageSize: pageSize,
      },
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error("Error fetching waitlist users:", error)
    return {
      success: false,
      error: "Failed to fetch waitlist users",
    }
  }
}

export async function exportWaitlistUsers(): Promise<ServiceResponse<WaitlistUser[]>> {
  try {
    // In a real app, this would fetch all users for export
    const result = await getWaitlistUsers(1, 1000) // Get all users

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.results,
      }
    }

    return {
      success: false,
      error: "Failed to fetch users for export",
    }
  } catch (error) {
    console.error("Error exporting waitlist users:", error)
    return {
      success: false,
      error: "Failed to export waitlist users",
    }
  }
}
