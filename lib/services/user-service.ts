import { get } from "../api"
import type { ApiResponse, PaginatedResponse } from "../api"
import type { Package } from "./package-service"

export interface UserProfile {
  id: string
  email: string
  profile: {
    username: string
    firstname: string
    lastname: string
    mobileNumber: string
    gender: string
    averageRating: number
  }
  influencer: boolean
  verified: boolean
  accountType: string
  socialMedia: {
    twitter: boolean
    youtube: boolean
    instagram: boolean
    tiktok: boolean
  }
  description: string
  avatar: string
  backdrop: string
  isActive: boolean
}

export interface UserFaq {
  _id: string
  question: string
  answer: string
}

export interface UserRating {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    "1": number
    "2": number
    "3": number
    "4": number
    "5": number
  }
}

export interface ReviewUser {
  avatar: string
  profile: {
    username: string
    firstname: string
    lastname: string
    averageRating: number
  }
  category?: string[]
  isActive: boolean
}

export interface UserReview {
  createdBy: ReviewUser
  rating: number
  message: string
  createdAt: string
}

/**
 * Get user profile information
 */
export const getUserProfile = async (userId: string): Promise<ApiResponse<UserProfile>> => {
  return get<ApiResponse<UserProfile>>(`/public/profile/${userId}`)
}

/**
 * Get user packages
 */
export const getUserPackages = async (
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<ApiResponse<PaginatedResponse<Package>>> => {
  return get<ApiResponse<PaginatedResponse<Package>>>(`/public/packages/${userId}`, {
    includeUser: true,
    page,
    pageSize,
  })
}

/**
 * Get user FAQs
 */
export const getUserFaqs = async (
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<ApiResponse<PaginatedResponse<UserFaq>>> => {
  return get<ApiResponse<PaginatedResponse<UserFaq>>>(`/public/faq/${userId}`, { page, pageSize })
}

/**
 * Get user rating information
 */
export const getUserRating = async (userId: string): Promise<ApiResponse<UserRating>> => {
  return get<ApiResponse<UserRating>>(`/rate/${userId}`)
}

/**
 * Get user reviews
 */
export const getUserReviews = async (
  userId: string,
  page = 1,
  pageSize = 10,
): Promise<ApiResponse<PaginatedResponse<UserReview>>> => {
  return get<ApiResponse<PaginatedResponse<UserReview>>>(`/rate/reviews/${userId}`, { page, pageSize })
}
