"use client"

import { useState } from "react"
import { Search, X, MessageSquare } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock chat data
interface Participant {
  _id: string
  avatar: string
  isActive: boolean
  profile: {
    firstname: string
    lastname: string
    averageRating: number
  }
}

interface LastMessage {
  lastSender: string
  message: string
  includeImage: boolean
  includeAudio: boolean
  includeVideo: boolean
  includeFile: boolean
  unread: boolean
  unreadCount: number
}

interface Conversation {
  conversationId: string
  lastMessage: LastMessage
  updatedAt: string
  participants: Participant[]
}

interface ChatData {
  results: Conversation[]
  pagination: {
    totalItems: number
    currentPage: number
    totalPages: number
    pageSize: number
  }
}

const MOCK_CHAT_DATA: ChatData = {
  results: [
    {
      conversationId: "67dc4ba3f2770376aa887d6a",
      lastMessage: {
        lastSender: "67db607a75d90a5dff14a255",
        message: "Gm",
        includeImage: false,
        includeAudio: false,
        includeVideo: false,
        includeFile: false,
        unread: true,
        unreadCount: 0,
      },
      updatedAt: "2025-03-20T17:09:04.929Z",
      participants: [
        {
          _id: "67db607a75d90a5dff14a255",
          avatar: "https://res.cloudinary.com/ddhwvds38/image/upload/v1742466628/uploads/akyikenkhzpprmpjtqhk.png",
          isActive: false,
          profile: {
            firstname: "Daniel",
            lastname: "Jet",
            averageRating: 3.6666666666666665,
          },
        },
        {
          _id: "6744eefe8576432aad4ccdb8",
          profile: {
            firstname: "John",
            lastname: "Doe",
            averageRating: 5,
          },
          avatar: "https://res.cloudinary.com/ddhwvds38/image/upload/v1734279590/images/kfswg0omribwxyornjhl.jpg",
          isActive: false,
        },
      ],
    },
    {
      conversationId: "67c1c3b61295562c2fee0ac6",
      lastMessage: {
        lastSender: "679baa21d4162934b42e0002",
        message: "Yo",
        includeImage: false,
        includeAudio: false,
        includeVideo: false,
        includeFile: false,
        unread: false,
        unreadCount: 0,
      },
      updatedAt: "2025-03-18T14:20:17.332Z",
      participants: [
        {
          _id: "6744eefe8576432aad4ccdb8",
          profile: {
            firstname: "John",
            lastname: "Doe",
            averageRating: 5,
          },
          avatar: "https://res.cloudinary.com/ddhwvds38/image/upload/v1734279590/images/kfswg0omribwxyornjhl.jpg",
          isActive: false,
        },
        {
          _id: "67db607a75d90a5dff14a255",
          avatar: "https://res.cloudinary.com/ddhwvds38/image/upload/v1742466628/uploads/akyikenkhzpprmpjtqhk.png",
          isActive: false,
          profile: {
            firstname: "Daniel",
            lastname: "Jet",
            averageRating: 3.6666666666666665,
          },
        },
      ],
    },
  ],
  pagination: {
    totalItems: 2,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  },
}

export default function ChatPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CHAT_DATA.results)

  const filteredConversations = conversations.filter((conversation) => {
    const participants = conversation.participants
    return (
      participants.some(
        (participant) =>
          participant.profile.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.profile.lastname.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || conversation.lastMessage.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      // Yesterday
      return "Yesterday"
    } else if (diffInDays < 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getOtherParticipant = (conversation: Conversation) => {
    // In a real app, you would compare with the current user's ID
    // For demo purposes, we'll just return the first participant
    return conversation.participants[0]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-[#2B2B30] rounded-lg bg-white dark:bg-[#1F1F23] text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#1F1F23] rounded-xl border border-gray-200 dark:border-[#2B2B30] overflow-hidden">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-[#2B2B30]">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation)
              return (
                <Link
                  key={conversation.conversationId}
                  href={`/chat/${conversation.conversationId}`}
                  className="block hover:bg-gray-50 dark:hover:bg-[#2B2B30]/50 transition-colors"
                >
                  <div className="p-4 flex items-start">
                    <div className="relative mr-3">
                      <Image
                        src={otherParticipant.avatar || "/placeholder.svg"}
                        alt={`${otherParticipant.profile.firstname} ${otherParticipant.profile.lastname}`}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {otherParticipant.isActive && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-[#1F1F23]"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {otherParticipant.profile.firstname} {otherParticipant.profile.lastname}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(conversation.updatedAt)}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "text-sm truncate mt-1",
                          conversation.lastMessage.unread
                            ? "font-medium text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400",
                        )}
                      >
                        {conversation.lastMessage.message}
                      </p>
                    </div>

                    {conversation.lastMessage.unread && (
                      <div className="ml-3 flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="py-12 px-4 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No conversations found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No conversations match your search criteria."
                : "Start a new conversation by messaging a user."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
