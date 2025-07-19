import apiRequest from "@/lib/api"

export interface PlatformSettings {
  _id?: string
  isWithdrawalEnabled: boolean
  isBookingEnabled: boolean
  isOrderEnabled: boolean
  isPackagesEnabled: boolean
  isFaqsEnabled: boolean
  isRatingEnabled: boolean
  isSaveAndFoldersEnabled: boolean
  isUploadEnabled: boolean
  isMessageEnabled: boolean
  isTwoFactorsEnabled: boolean
  isWaitListEnabled: boolean
}

export interface SettingsResponse {
  message: string
  data: PlatformSettings
}

export async function getPlatformSettings(): Promise<SettingsResponse> {
  const response = await apiRequest("GET", "/settings")
  return response.data
}

export async function updatePlatformSettings(
  settings: Omit<PlatformSettings, "_id" | "__v">,
): Promise<SettingsResponse> {
  const response = await apiRequest("PUT", "/settings", settings)
  return response.data
}
