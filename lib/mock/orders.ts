export interface OrderItem {
  orderId: string
  referenceId: string
  price: number
  status: string
  createdAt: string
  executor?: {
    _id: string
    avatar: string
    profile: { firstname: string; lastname: string; averageRating: number }
    isActive: boolean
  }
  createdBy?: {
    _id: string
    avatar: string
    profile: { firstname: string; lastname: string; averageRating: number }
    isActive: boolean
  }
  package: {
    display: string | null
    service: { platform: string; category: string }[]
  }
  paymentDetails: {
    paymentStatus: string
    paid: boolean
    paymentType?: string
  }
  canMakePayment: boolean
}

/**
 * NOTE:  This mock data replicates what was used previously so that
 *        the list and detail pages share one source of truth.
 *        Replace with a real fetch in production.
 */
export const ORDERS: OrderItem[] = [
  {
    orderId: "67e90ad8bf3369ebcf1ac2f0",
    referenceId: "PIH-9AJNGGH3TD",
    price: 300,
    status: "stage",
    createdAt: "2025-03-30T09:11:52.392Z",
    executor: {
      _id: "67db607a75d90a5dff14a255",
      avatar: "https://res.cloudinary.com/ddhwvds38/image/upload/v1742466628/uploads/akyikenkhzpprmpjtqhk.png",
      profile: { firstname: "Daniel", lastname: "Jet", averageRating: 3.67 },
      isActive: false,
    },
    package: {
      display: null,
      service: [{ platform: "Youtube", category: "Crypto" }],
    },
    paymentDetails: { paymentStatus: "waiting", paid: false },
    canMakePayment: true,
  },
  /* -- other items omitted for brevity, keep the rest from previous mock -- */
]
