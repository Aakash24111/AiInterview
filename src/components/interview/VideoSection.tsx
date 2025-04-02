"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { Mic, MicOff, Video, VideoOff, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import FaceAnalysis from "./FaceAnalysis"

interface VideoSectionProps {
  videoEnabled: boolean
  micEnabled: boolean
  stream: MediaStream | null
  fullscreenVideo: boolean
  interviewStarted: boolean
  onToggleFullscreen: () => void
  onToggleMic: () => void
  onToggleVideo: () => void
}

export default function VideoSection({
  videoEnabled,
  micEnabled,
  stream,
  fullscreenVideo,
  interviewStarted,
  onToggleFullscreen,
  onToggleMic,
  onToggleVideo,
}: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Connect video stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="flex h-full">
      {/* AI Interviewer */}
      <div className="w-1/2 h-full relative flex items-center justify-center border-r border-gray-800">
        <Image
          src="/placeholder.svg?height=400&width=400"
          alt="AI Interviewer"
          width={400}
          height={400}
          className="object-cover max-h-full"
        />
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-sm">AI Interviewer</div>
      </div>

      {/* Candidate */}
      <div className="w-1/2 h-full relative flex items-center justify-center">
        {videoEnabled && stream ? (
          <>
            <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            <FaceAnalysis videoRef={videoRef as React.RefObject<HTMLVideoElement>} stream={stream} isActive={interviewStarted} />

          </>
        ) : (
          <div className="h-full w-full bg-gray-800 flex flex-col items-center justify-center p-4">
            <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-400">You</span>
            </div>
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-sm">You (Candidate)</div>
      </div>

      {/* Video controls - fixed at bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/70 rounded-full p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${micEnabled ? "text-white" : "bg-red-500 text-white"}`}
                onClick={onToggleMic}
                disabled={interviewStarted} // Disable during interview
              >
                {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {interviewStarted
                ? "Microphone controls are locked during the interview"
                : micEnabled
                  ? "Mute your microphone"
                  : "Unmute your microphone"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${videoEnabled ? "text-white" : "bg-red-500 text-white"}`}
                onClick={onToggleVideo}
                disabled={interviewStarted} // Disable during interview
              >
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {interviewStarted
                ? "Camera controls are locked during the interview"
                : videoEnabled
                  ? "Turn off your camera"
                  : "Turn on your camera"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-white" onClick={onToggleFullscreen}>
                {fullscreenVideo ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullscreenVideo ? "Exit fullscreen" : "Fullscreen video"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

