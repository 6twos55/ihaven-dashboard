import type { ReactNode } from "react"
import Layout from "@/components/kokonutui/layout"

interface ContentLayoutProps {
  children: ReactNode
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  return <Layout>{children}</Layout>
}
