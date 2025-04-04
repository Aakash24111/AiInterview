"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { InterviewMessage } from "./types"

interface InterviewChatProps {
  messages: InterviewMessage[]
  onSendMessage: (message: string) => void
  isTyping: boolean
}

export default function InterviewChat({ messages, onSendMessage, isTyping }: InterviewChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    onSendMessage(newMessage); // Calls the function from `InterviewComponent`
    setNewMessage(""); // Clears input field
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 max-h-[calc(100vh-150px)]">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-4 flex ${msg.sender === "interviewer" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "interviewer" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm whitespace-pre-line">{msg.message}</span>
                <span className="text-xs opacity-70 mt-1 text-right">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="p-4 border-t sticky bottom-0 bg-background">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} className="h-auto">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
