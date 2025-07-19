import { get, post, patch, del } from "../api"
import type { ApiResponse, PaginatedResponse } from "../api"

export interface PackageService {
  platform?: string
  category?: string
}

export interface PackageUser {
  _id: string
  avatar: string
  profile: {
    username: string
    firstname: string
    lastname: string
    averageRating: number
  }
  category: string[]
  isActive: boolean
}

export interface Package {
  _id: string
  display: string | null
  service: PackageService[]
  description: string
  price: number
  createdBy: PackageUser
  isEnabled: boolean
}

export interface PackageQueryParams {
  includeUser?: boolean
  page?: number
  pageSize?: number
  createdBy?: string
  min?: number
  max?: number
  platform?: string
  category?: string
  duration?: number
  search?: string
}

/**
 * Get packages with pagination and filtering
 */
export const getPackages = async (
  params: PackageQueryParams = {},
): Promise<ApiResponse<PaginatedResponse<Package>>> => {
  return get<ApiResponse<PaginatedResponse<Package>>>("/packages", params)
}

/**
 * Get a single package by ID
 */
export const getPackageById = async (id: string): Promise<ApiResponse<Package>> => {
  return get<ApiResponse<Package>>(`/package/${id}`)
}

/**
 * Create a new package
 */
export const createPackage = async (packageData: Omit<Package, "_id" | "createdBy">): Promise<ApiResponse<Package>> => {
  return post<ApiResponse<Package>>("/package", packageData)
}

/**
 * Update an existing package
 */
export const updatePackage = async (id: string, packageData: Partial<Package>): Promise<ApiResponse<Package>> => {
  return patch<ApiResponse<Package>>(`/package/${id}`, packageData)
}

/**
 * Delete a package
 */
export const deletePackage = async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
  return del<ApiResponse<{ deleted: boolean }>>(`/package/${id}`)
}

/**
 * Activate a package
 */
export const activatePackage = async (id: string): Promise<ApiResponse<Package>> => {
  return patch<ApiResponse<Package>>(`/package/${id}`, { isEnabled: true })
}

/**
 * Deactivate a package
 */
export const deactivatePackage = async (id: string): Promise<ApiResponse<Package>> => {
  return patch<ApiResponse<Package>>(`/package/${id}`, { isEnabled: false })
}

/**
 * Toggle package activation status
 */
export const togglePackageStatus = async (id: string, isEnabled: boolean): Promise<ApiResponse<Package>> => {
  return patch<ApiResponse<Package>>(`/package/${id}`, { isEnabled })
}
