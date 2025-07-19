"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, HelpCircle } from "lucide-react"

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("faq")
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([])

  const toggleFaq = (id: string) => {
    if (expandedFaqs.includes(id)) {
      setExpandedFaqs(expandedFaqs.filter((faqId) => faqId !== id))
    } else {
      setExpandedFaqs([...expandedFaqs, id])
    }
  }

  const faqs = [
    {
      id: "faq-1",
      question: "How do I create a new project?",
      answer:
        "To create a new project, navigate to the Projects page from the sidebar, then click on the 'Create Project' button in the top right corner. Fill in the required information in the form and click 'Create'.",
    },
    {
      id: "faq-2",
      question: "How do I invite team members?",
      answer:
        "You can invite team members by going to the Organization page, selecting the 'Members' tab, and clicking on the 'Invite Member' button. Enter their email address and select their role, then click 'Send Invitation'.",
    },
    {
      id: "faq-3",
      question: "How do I set up payment methods?",
      answer:
        "To set up payment methods, go to the Settings page and select the 'Billing' tab. Click on 'Add Payment Method' and follow the instructions to add your credit card or other payment information.",
    },
    {
      id: "faq-4",
      question: "How do I view my transaction history?",
      answer:
        "You can view your transaction history by navigating to the Transactions page from the sidebar. This page displays all your past transactions, which you can filter by date, type, or status.",
    },
    {
      id: "faq-5",
      question: "How do I change my account password?",
      answer:
        "To change your password, go to the Settings page and select the 'Security' tab. Click on the 'Change Password' button and follow the prompts to set a new password.",
    },
    {
      id: "faq-6",
      question: "What payment methods are accepted?",
      answer:
        "We accept major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise customers. Cryptocurrency payments are also supported through our integration with various blockchain networks.",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Find answers to common questions and get support
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search for help..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="faq" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQs</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guides</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
