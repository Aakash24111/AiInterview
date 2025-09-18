"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import type { InterviewMessage } from "./types"

interface InterviewChatProps {
  messages: InterviewMessage[]
  onSendMessage: (message: string) => void
  isTyping: boolean
}

export default function InterviewChat({ messages, onSendMessage, isTyping }: InterviewChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const [wsMessages, setWsMessages] = useState<InterviewMessage[]>([])
  const [waitingForResponse, setWaitingForResponse] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const stompClientRef = useRef<Client | null>(null)
  const [connected, setConnected] = useState(false)
  const didInitRef = useRef(false)

  const generateId = () => (typeof crypto !== "undefined" && (crypto as any)?.randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`)

  // Auto-scroll on update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, wsMessages])

  // WebSocket setup
  useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true
    const token = localStorage.getItem("userToken") || ""
    const wsUrl = `http://localhost:8003/websocket?token=${token}`
    console.log("🔌 Initializing SockJS:", wsUrl)
    const socket = new SockJS(wsUrl)

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 3000,
      debug: (str) => console.log("STOMP debug:", str),
      onConnect: () => {
        console.log("🟢 WebSocket connected")
        setConnected(true)

        client.subscribe("/user/queue/chat", (msg) => {
          console.log("📥 Received (global subscribe):", msg.body)
          const backendMessage: InterviewMessage = {
            id: generateId(),
            message: msg.body,
            timestamp: new Date().toISOString(),
            sender: "interviewer",
          }
          setWsMessages((prev) => [...prev, backendMessage])
          setWaitingForResponse(false)
        })
      },
      onDisconnect: () => {
        console.warn("🟡 WebSocket disconnected")
        setConnected(false)
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers?.message, frame.body)
      },
      onWebSocketError: (event) => {
        console.error("❌ WebSocket error:", event)
      },
    })

    stompClientRef.current = client
    try {
      client.activate()
    } catch (e) {
      console.error("❌ Failed to activate STOMP client:", e)
    }

    const handleUnload = () => {
      try {
        if (stompClientRef.current?.active) {
          stompClientRef.current.deactivate()
        }
      } catch {}
    }
    window.addEventListener("beforeunload", handleUnload)

    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      // Do not deactivate here to avoid React StrictMode double-invocation disconnecting the client
    }
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: InterviewMessage = {
      id: generateId(),
      message: newMessage,
      timestamp: new Date().toISOString(),
      sender: "user",
    }

    setWsMessages((prev) => [...prev, userMessage])
    setWaitingForResponse(true)

    if (connected && stompClientRef.current) {
      const subscription = stompClientRef.current.subscribe("/user/queue/chat", (msg) => {
        console.log("📥 Received (send-cycle subscribe):", msg.body)
        const backendMessage: InterviewMessage = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          message: msg.body,
          timestamp: new Date().toISOString(),
          sender: "interviewer",
        }
        setWsMessages((prev) => [...prev, backendMessage])
        setWaitingForResponse(false)
        subscription.unsubscribe()
      })

      stompClientRef.current.publish({
        destination: "/app/chat",
        body: newMessage,
      })

      // Wait indefinitely for backend response; no timeout
    } else {
      const fallbackMessage: InterviewMessage = {
        id: generateId(),
        message: "⚠️ Not connected to server.",
        timestamp: new Date().toISOString(),
        sender: "interviewer",
      }
      setWsMessages((prev) => [...prev, fallbackMessage])
    }

    setNewMessage("")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-2 max-h-[calc(100vh-150px)]">
        {[...messages, ...wsMessages].map((msg) => (
          <div key={msg.id} className={`mb-4 flex ${msg.sender === "interviewer" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "interviewer"
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm whitespace-pre-line">{msg.message}</span>
                <span className="text-xs opacity-70 mt-1 text-right">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        {(isTyping || waitingForResponse) && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:150ms]"></div>
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse [animation-delay:300ms]"></div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {waitingForResponse ? "Waiting for interviewer..." : "Interviewer is typing..."}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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