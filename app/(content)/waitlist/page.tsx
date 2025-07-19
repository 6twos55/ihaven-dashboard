import type { Metadata } from "next"
import WaitlistClientPage from "./WaitlistClientPage"

export const metadata: Metadata = {
  title: "Waitlist | Financial Dashboard",
  description: "Manage and view waitlist users",
}

export default function WaitlistPage() {
  return <WaitlistClientPage />
}
