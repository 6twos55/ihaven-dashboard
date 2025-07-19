export interface Author {
  id: string
  name: string
  avatar: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  author: Author
  publishedAt: string
  updatedAt?: string
}

export interface WaitlistUser {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  companyName?: string
  mobileNumber?: string
  street?: string
  city?: string
  state?: string
  lga?: string
  country?: string
  countryCode?: string
  cryptoNative: boolean
  location?: string
  ipAddress?: string
  userBrowserIpAddress?: string
  usersLocation?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface PaginationMeta {
  totalItems: number
  currentPage: number
  totalPages: number
  pageSize: number
}

export interface WaitlistApiResponse {
  message: string
  data: {
    results: WaitlistUser[]
    pagination: PaginationMeta
  }
}
