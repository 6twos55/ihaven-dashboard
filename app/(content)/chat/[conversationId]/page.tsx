"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, ImageIcon, Paperclip, Mic, MoreVertical } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock message data
interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
  media?: {
    type: "image" | "audio" | "video" | "file"
    url: string
    name?: string
  }
}

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

// Mock conversation data
const MOCK_PARTICIPANTS: Participant[] = [
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
]

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    senderId: "67db607a75d90a5dff14a255",
    text: "Hey, how are you doing?",
    timestamp: "2025-03-20T16:30:00Z",
    read: true,
  },
  {
    id: "2",
    senderId: "6744eefe8576432aad4ccdb8",
    text: "I'm good, thanks! How about you?",
    timestamp: "2025-03-20T16:35:00Z",
    read: true,
  },
  {
    id: "3",
    senderId: "67db607a75d90a5dff14a255",
    text: "Doing well! Just checking in about the project.",
    timestamp: "2025-03-20T16:40:00Z",
    read: true,
  },
  {
    id: "4",
    senderId: "6744eefe8576432aad4ccdb8",
    text: "Sure, I've been working on it. Here's a screenshot of the progress:",
    timestamp: "2025-03-20T16:45:00Z",
    read: true,
  },
  {
    id: "5",
    senderId: "6744eefe8576432aad4ccdb8",
    text: "",
    timestamp: "2025-03-20T16:46:00Z",
    read: true,
    media: {
      type: "image",
      url: "https://res.cloudinary.com/ddhwvds38/image/upload/v1742807872/uploads/fjxwp0gb0fq3vivyl6b5.png",
    },
  },
  {
    id: "6",
    senderId: "67db607a75d90a5dff14a255",
    text: "Looks great! Let's catch up tomorrow to discuss next steps.",
    timestamp: "2025-03-20T17:00:00Z",
    read: true,
  },
  {
    id: "7",
    senderId: "6744eefe8576432aad4ccdb8",
    text: "Sounds good!",
    timestamp: "2025-03-20T17:05:00Z",
    read: true,
  },
  {
    id: "8",
    senderId: "67db607a75d90a5dff14a255",
    text: "Gm",
    timestamp: "2025-03-20T17:09:04.929Z",
    read: false,
  },
]

export default function ChatDetailPage() {
  const { conversationId } = useParams()
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [participants] = useState<Participant[]>(MOCK_PARTICIPANTS)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // In a real app, you would fetch the conversation data based on the ID
  // For demo purposes, we'll use the mock data

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      // In a real app, this would be the current user's ID
      senderId: "67db607a75d90a5dff14a255",
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })
    }
  }

  const getMessageGroups = () => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ""
    let currentGroup: Message[] = []

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toDateString()

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup })
        }
        currentDate = messageDate
        currentGroup = [message]
      } else {
        currentGroup.push(message)
      }
    })

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup })
    }

    return groups
  }

  const getParticipantById = (id: string) => {
    return participants.find((p) => p._id === id)
  }

  // Get the other participant (not the current user)
  const otherParticipant = participants[0]

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="bg-white dark:bg-[#1F1F23] border-b border-gray-200 dark:border-[#2B2B30] p-4 flex items-center">
        <Link href="/chat" className="mr-3">
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Link>

        <div className="relative mr-3">
          <Image
            src={otherParticipant.avatar || "/placeholder.svg"}
            alt={`${otherParticipant.profile.firstname} ${otherParticipant.profile.lastname}`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          {otherParticipant.isActive && (
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-[#1F1F23]"></div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {otherParticipant.profile.firstname} {otherParticipant.profile.lastname}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {otherParticipant.isActive ? "Active now" : "Offline"}
          </p>
        </div>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </Button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-[#0F0F12]/50">
        {getMessageGroups().map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">
                {formatMessageDate(group.messages[0].timestamp)}
              </span>
            </div>

            {group.messages.map((message, messageIndex) => {
              const isCurrentUser = message.senderId === "67db607a75d90a5dff14a255"
              const sender = getParticipantById(message.senderId)

              return (
                <div key={message.id} className={cn("flex mb-4", isCurrentUser ? "justify-end" : "justify-start")}>
                  {!isCurrentUser && (
                    <div className="mr-2 flex-shrink-0">
                      <Image
                        src={sender?.avatar || "/placeholder.svg"}
                        alt={`${sender?.profile.firstname || "User"}`}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </div>
                  )}

                  <div className={cn("max-w-[70%]", isCurrentUser ? "items-end" : "items-start")}>
                    {message.media ? (
                      <div
                        className={cn(
                          "rounded-lg overflow-hidden mb-1",
                          isCurrentUser
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-[#1F1F23] text-gray-900 dark:text-white border border-gray-200 dark:border-[#2B2B30]",
                        )}
                      >
                        {message.media.type === "image" && (
                          <div className="relative">
                            <Image
                              src={message.media.url || "/placeholder.svg"}
                              alt="Shared image"
                              width={300}
                              height={200}
                              className="max-w-full rounded-lg"
                            />
                          </div>
                        )}
                        {message.text && (
                          <div className="p-3">
                            <p>{message.text}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "p-3 rounded-lg",
                          isCurrentUser
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-[#1F1F23] text-gray-900 dark:text-white border border-gray-200 dark:border-[#2B2B30]",
                        )}
                      >
                        <p>{message.text}</p>
                      </div>
                    )}

                    <div
                      className={cn(
                        "text-xs text-gray-500 dark:text-gray-400 mt-1",
                        isCurrentUser ? "text-right" : "text-left",
                      )}
                    >
                      {formatMessageTime(message.timestamp)}
                      {isCurrentUser && <span className="ml-1">{message.read ? "Read" : "Sent"}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="bg-white dark:bg-[#1F1F23] border-t border-gray-200 dark:border-[#2B2B30] p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <ImageIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <Mic className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="mx-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
