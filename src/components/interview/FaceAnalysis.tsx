"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ThumbsUp, Smile, Meh, Frown, AlertTriangle, Eye, EyeOff } from "lucide-react"
import type { FaceAnalysisResult } from "./types"
import { Badge } from "@/components/ui/badge"

interface FaceAnalysisProps {
  videoRef: React.RefObject<HTMLVideoElement>
  stream: MediaStream | null
  isActive: boolean
}

export default function FaceAnalysis({ videoRef, stream, isActive }: FaceAnalysisProps) {
  const [analysisResult, setAnalysisResult] = useState<FaceAnalysisResult>({
    confidence: 75,
    attention: 90,
    cheating: false,
    emotions: {
      happy: 60,
      neutral: 30,
      anxious: 10,
    },
  })
  const [faceDetected, setFaceDetected] = useState(true)
  const [lookingAway, setLookingAway] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Add more realistic face tracking simulation
  const [headPosition, setHeadPosition] = useState({ x: 0, y: 0 })
  const [lastPositions, setLastPositions] = useState<Array<{ x: number; y: number }>>([])

  // Simulate face analysis
  useEffect(() => {
    if (!isActive || !stream) return

    // Start face analysis
    analysisIntervalRef.current = setInterval(() => {
      // Simulate face detection
      const isFaceDetected = Math.random() > 0.1 // 90% chance face is detected
      setFaceDetected(isFaceDetected)

      if (isFaceDetected) {
        // Simulate head movement
        const newX = Math.min(Math.max(-30, headPosition.x + (Math.random() * 10 - 5)), 30)
        const newY = Math.min(Math.max(-30, headPosition.y + (Math.random() * 10 - 5)), 30)

        setHeadPosition({ x: newX, y: newY })

        // Keep track of last 5 positions to detect rapid movements
        setLastPositions((prev) => {
          const updated = [...prev, { x: newX, y: newY }]
          if (updated.length > 5) updated.shift()
          return updated
        })

        // Detect if looking away based on head position
        const isLookingAway = Math.abs(newX) > 15 || Math.abs(newY) > 15
        setLookingAway(isLookingAway)

        // Detect rapid head movements (potential cheating)
        let rapidMovement = false
        if (lastPositions.length >= 3) {
          const movements = lastPositions.slice(1).map((pos, i) => {
            const prevPos = lastPositions[i]
            return Math.sqrt(Math.pow(pos.x - prevPos.x, 2) + Math.pow(pos.y - prevPos.y, 2))
          })

          rapidMovement = movements.some((m) => m > 10)
        }

        // Mark as cheating if looking away or rapid head movements
        const isCheating = isLookingAway || rapidMovement

        // Update confidence score with some randomness
        setAnalysisResult((prev) => {
          const confidenceChange = Math.floor(Math.random() * 7) - 3
          const attentionChange = isLookingAway ? -10 : Math.floor(Math.random() * 5) - 2

          // Calculate new values with bounds
          const newConfidence = Math.max(30, Math.min(95, prev.confidence + confidenceChange))
          const newAttention = Math.max(20, Math.min(100, prev.attention + attentionChange))

          // Random emotion changes
          const happyChange = Math.floor(Math.random() * 10) - 5
          const anxiousChange = isLookingAway ? 5 : Math.floor(Math.random() * 10) - 5

          return {
            confidence: newConfidence,
            attention: newAttention,
            cheating: isCheating,
            emotions: {
              happy: Math.max(0, Math.min(100, prev.emotions.happy + happyChange)),
              neutral: 100 - (prev.emotions.happy + happyChange) - (prev.emotions.anxious + anxiousChange),
              anxious: Math.max(0, Math.min(100, prev.emotions.anxious + anxiousChange)),
            },
          }
        })
      }
    }, 1000) // Update more frequently for smoother simulation

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current)
      }
    }
  }, [isActive, stream, headPosition, lastPositions])

  const getConfidenceEmoji = () => {
    if (analysisResult.confidence >= 80) return <ThumbsUp className="h-4 w-4 text-green-500" />
    if (analysisResult.confidence >= 60) return <Smile className="h-4 w-4 text-blue-500" />
    if (analysisResult.confidence >= 40) return <Meh className="h-4 w-4 text-yellow-500" />
    return <Frown className="h-4 w-4 text-red-500" />
  }

  const getConfidenceColor = () => {
    if (analysisResult.confidence >= 80) return "bg-green-500"
    if (analysisResult.confidence >= 60) return "bg-blue-500"
    if (analysisResult.confidence >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getAttentionColor = () => {
    if (analysisResult.attention >= 80) return "bg-green-500"
    if (analysisResult.attention >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (!isActive) return null

  // Add head position indicator to the UI
  return (
    <div className="absolute top-2 left-2 right-2 bg-black/70 text-white p-2 rounded-md text-xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span>Confidence:</span>
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${getConfidenceColor()}`} style={{ width: `${analysisResult.confidence}%` }}></div>
          </div>
          {getConfidenceEmoji()}
        </div>

        {!faceDetected && (
          <Badge variant="destructive" className="text-[10px] h-5">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Face not detected
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1">
        <span>Attention:</span>
        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full ${getAttentionColor()}`} style={{ width: `${analysisResult.attention}%` }}></div>
        </div>
        {lookingAway ? <EyeOff className="h-3 w-3 text-red-400" /> : <Eye className="h-3 w-3 text-green-400" />}
      </div>

      {/* Head position indicator */}
      <div className="flex items-center justify-between">
        <span>Head position:</span>
        <div className="relative w-16 h-16 border border-gray-600 rounded-md">
          <div
            className={`absolute w-3 h-3 rounded-full ${lookingAway ? "bg-red-500" : "bg-green-500"}`}
            style={{
              left: `${50 + (headPosition.x / 30) * 50}%`,
              top: `${50 + (headPosition.y / 30) * 50}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-10 h-10 border-2 border-dashed border-white rounded-full"></div>
          </div>
        </div>
      </div>

      {lookingAway && (
        <div className="bg-red-500/30 border border-red-500 rounded px-1 py-0.5 flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1 text-red-400" />
          <span>Not looking at camera - Suspicious</span>
        </div>
      )}

      {analysisResult.cheating && !lookingAway && (
        <div className="bg-red-500/30 border border-red-500 rounded px-1 py-0.5 flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1 text-red-400" />
          <span>Suspicious activity detected</span>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" width="100" height="100" />
    </div>
  )
}

