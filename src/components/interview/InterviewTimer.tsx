"use client"

import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface InterviewTimerProps {
  initialTime: number // in seconds
  isActive: boolean
  onTimeEnd: () => void
}

export default function InterviewTimer({ initialTime, isActive, onTimeEnd }: InterviewTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          if (newTime <= 10 && newTime > 0) {
            setShowWarning(true)
          }
          if (newTime <= 0) {
            clearInterval(timer)
            onTimeEnd()
          }
          return newTime
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isActive, timeLeft, onTimeEnd])

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <>
      <div
        className={`flex items-center gap-1 px-3 py-1 rounded-full ${
          timeLeft <= 10 ? "bg-red-100 text-red-600 animate-pulse" : "bg-muted"
        }`}
      >
        <Clock className="h-4 w-4" />
        <span className="font-medium">{formatTime()}</span>
      </div>

      {showWarning && (
        <Alert variant="destructive" className="mx-4 mt-4 animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Time is running out!</AlertTitle>
          <AlertDescription>
            You have less than 10 seconds remaining in your interview. Please wrap up your responses.
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}

