"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, PhoneOff, Lightbulb, CheckCircle, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

import CameraPrompt from "./CameraPrompt"
import VideoSection from "./VideoSection"
import InterviewChat from "./InterviewChat"
import CodingChallenge from "./CodingChallenge"
import InterviewTimer from "./InterviewTimer"

import {
  interviewStages,
  initialMessages,
  programmingLanguages,
  codingChallenges,
  interviewTips,
  virtualBackgrounds,
} from "./data"
import type { CodeLanguage, CodingChallenge as CodingChallengeType, InterviewMessage, Job } from "./types"

interface InterviewComponentProps {
  job: Job
}

export default function InterviewComponent({ job }: InterviewComponentProps) {
  const router = useRouter()
  const [micEnabled, setMicEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState<InterviewMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallengeType>(codingChallenges[0])
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript")
  const [code, setCode] = useState(codingChallenges[0].initialCode.javascript)
  const [fullscreenVideo, setFullscreenVideo] = useState(false)
  const [fullscreenCode, setFullscreenCode] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [interviewProgress, setInterviewProgress] = useState(20)
  const [isTyping, setIsTyping] = useState(false)
  const [codeOutput, setCodeOutput] = useState<string | null>(null)
  const [isRunningCode, setIsRunningCode] = useState(false)
  const [showPreparationTips, setShowPreparationTips] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState("none")
  const [showBackgroundSettings, setShowBackgroundSettings] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [showCameraPrompt, setShowCameraPrompt] = useState(false)
  const [cameraRetryCount, setCameraRetryCount] = useState(0)
  const [interviewStarted, setInterviewStarted] = useState(false)

  // Client-side only code
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize video stream
  useEffect(() => {
    if (isMounted) {
      setShowCameraPrompt(true)
    }
  }, [isMounted])

  // Update interview progress based on current stage
  useEffect(() => {
    setInterviewProgress((currentStage + 1) * 20)
  }, [currentStage])

  // Initialize camera
  const initializeCamera = async () => {
    try {
      // Only try to access camera if we're in a browser environment
      if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera access is not available in this environment.")
        setShowCameraPrompt(true)
        return
      }

      const newStream = await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .catch((err) => {
          // Handle permission errors specifically
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            throw new Error("Camera permission denied. Camera access is required for the interview.")
          }
          throw err // Re-throw other errors
        })

      setStream(newStream)

      // Reset video enabled state if we successfully got the stream
      setVideoEnabled(true)
      setMicEnabled(true)
      setCameraError(null)
      setShowCameraPrompt(false)

      // Start the interview once camera is enabled
      setInterviewStarted(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setVideoEnabled(false)
      setCameraRetryCount((prev) => prev + 1)

      // Set a more user-friendly error message
      if (err instanceof Error) {
        setCameraError(err.message)
      } else {
        setCameraError("Could not access camera. Camera access is required for the interview.")
      }

      // Keep showing the camera prompt
      setShowCameraPrompt(true)
    }
  }

  // Handle camera retry
  const handleCameraRetry = () => {
    setCameraError(null)
    initializeCamera()
  }

  useEffect(() => {
    return () => {
      // Clean up video stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  // Toggle microphone - only allowed before interview starts
  const toggleMic = () => {
    if (interviewStarted) return // Prevent toggling during interview

    if (stream) {
      const audioTracks = stream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !micEnabled
      })
      setMicEnabled(!micEnabled)
    }
  }

  // Toggle video - only allowed before interview starts
  const toggleVideo = async () => {
    if (interviewStarted) return // Prevent toggling during interview

    if (!videoEnabled) {
      // If video is currently disabled, try to enable it
      initializeCamera()
    } else {
      // If video is currently enabled, disable it
      if (stream) {
        stream.getVideoTracks().forEach((track) => {
          track.stop()
        })

        // Keep audio tracks if mic is enabled
        if (micEnabled && stream.getAudioTracks().length > 0) {
          const audioOnlyStream = new MediaStream()
          stream.getAudioTracks().forEach((track) => {
            audioOnlyStream.addTrack(track)
          })
          setStream(audioOnlyStream)
        } else {
          setStream(null)
        }

        setVideoEnabled(false)
        setShowCameraPrompt(true)
      }
    }
  }

  // Update the handleSendMessage function to advance the interview stages more reliably
  const handleSendMessage = async (message: string) => {
    if (!message || message.trim() === "") return; // Prevent empty messages
  
    // Add candidate's message to UI immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(), // Temporary ID
        sender: "candidate",
        message: message,
        timestamp: new Date().toISOString(),
      },
    ]);
  
    setIsTyping(true); // Show AI typing effect
  
    try {
      const response = await fetch("http://localhost:8001/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interview_id: 101, // Replace with actual interview ID
          user_id: 59,       // Replace with actual user ID
          message: message,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Response from backend:", data);
  
      if (!data.response) {
        throw new Error("Invalid response format from backend");
      }
  
      // Trim response: Add a newline after every full stop
      const formattedResponse = data.response.replace(/\. /g, ".\n");
  
      setTimeout(() => {
        setIsTyping(false); // Hide typing effect
  
        // Add AI response to UI
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now() + 1, // Unique ID for AI message
            sender: "interviewer",
            message: formattedResponse, // Use formatted response
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 2000); // Simulated delay for AI response
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  // Replace the handleResetCode function with this version
  const handleResetCode = () => {
    // Type guard to ensure we have a valid language key
    const language = selectedLanguage as CodeLanguage

    // Safe access with fallback
    if (language in selectedChallenge.initialCode) {
      setCode(selectedChallenge.initialCode[language])
    } else {
      setCode(selectedChallenge.initialCode.javascript)
    }

    setCodeOutput(null)
  }

  // Also update the handleLanguageChange function
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)

    // Type guard to ensure we have a valid language key
    const typedLanguage = language as CodeLanguage

    // Safe access with fallback
    if (typedLanguage in selectedChallenge.initialCode) {
      setCode(selectedChallenge.initialCode[typedLanguage])
    } else {
      setCode(selectedChallenge.initialCode.javascript)
    }

    setCodeOutput(null)
  }

  // And update the handleSelectChallenge function
  const handleSelectChallenge = (challenge: CodingChallengeType) => {
    setSelectedChallenge(challenge)

    // Type guard to ensure we have a valid language key
    const language = selectedLanguage as CodeLanguage

    // Safe access with fallback
    if (language in challenge.initialCode) {
      setCode(challenge.initialCode[language])
    } else {
      setCode(challenge.initialCode.javascript)
    }

    setCodeOutput(null)
  }

  const handleRunCode = () => {
    setIsRunningCode(true)
    setCodeOutput(null)

    // Simulate code execution
    setTimeout(() => {
      try {
        // This is a simplified simulation - in a real app you'd use a secure sandbox
        let testResults

        if (selectedLanguage === "python") {
          // For Python, we'll show a more realistic simulation
          const pythonTestResults = selectedChallenge.testCases.map((testCase: any) => {
            // Simulate Python execution
            let success = false
            let output = ""

            // For the reverse string challenge, actually implement the logic
            if (selectedChallenge.id === 1) {
              if (typeof testCase.input === "string") {
                output = testCase.input.split("").reverse().join("")
                success = output === testCase.expected
              }
            } else {
              // For other challenges, simulate with 70% success rate
              success = Math.random() > 0.3
              output = success ? testCase.expected : "Incorrect output"
            }

            return {
              input: JSON.stringify(testCase.input),
              expected: JSON.stringify(testCase.expected),
              output: JSON.stringify(output),
              success,
            }
          })

          testResults = pythonTestResults
        } else if (selectedLanguage === "javascript" || selectedLanguage === "typescript") {
          // For JavaScript/TypeScript, we can actually run the code
          testResults = selectedChallenge.testCases.map((testCase: any) => {
            let result
            let success

            // Create a function from the code string
            const userFunction = new Function("return " + code)()

            if (typeof testCase.input === "object") {
              // Handle cases like twoSum where input is an object with multiple params
              result = userFunction(...Object.values(testCase.input))
            } else {
              result = userFunction(testCase.input)
            }

            // Check if result matches expected
            if (Array.isArray(result) && Array.isArray(testCase.expected)) {
              success = JSON.stringify(result) === JSON.stringify(testCase.expected)
            } else {
              success = result === testCase.expected
            }

            return {
              input: JSON.stringify(testCase.input),
              expected: JSON.stringify(testCase.expected),
              output: JSON.stringify(result),
              success,
            }
          })
        } else {
          // For other languages, simulate the results
          testResults = selectedChallenge.testCases.map((testCase: any, index: number) => {
            // Simulate some successes and failures
            const success = Math.random() > 0.3

            return {
              input: JSON.stringify(testCase.input),
              expected: JSON.stringify(testCase.expected),
              output: success ? JSON.stringify(testCase.expected) : JSON.stringify("Incorrect output"),
              success,
            }
          })
        }

        const passedTests = testResults.filter((r: any) => r.success).length
        const totalTests = testResults.length

        setCodeOutput(`
Test Results (${passedTests}/${totalTests} passed):
${testResults
  .map(
    (r: any, i: number) => `
Test ${i + 1}:
  Input: ${r.input}
  Expected: ${r.expected}
  Output: ${r.output}
  Result: ${r.success ? "✅ PASS" : "❌ FAIL"}
`,
  )
  .join("")}
        `)

        // If all tests pass, advance to next stage
        if (passedTests === totalTests && currentStage === 2) {
          setTimeout(() => {
            setCurrentStage(3)
            setActiveTab("chat")

            // Add a message from the interviewer
            const response: InterviewMessage = {
              id: messages.length + 1,
              sender: "interviewer",
              message:
                "Great job on the coding challenge! You've passed all the test cases. Now, let's move on to some behavioral questions. Can you tell me about a challenging project you worked on and how you overcame obstacles?",
              timestamp: new Date().toISOString(),
            }

            setMessages((prevMessages) => [...prevMessages, response])
          }, 2000)
        }
      } catch (error) {
        setCodeOutput(`Error executing code: ${error}`)
      } finally {
        setIsRunningCode(false)
      }
    }, 1500)
  }

  const handleEndInterview = () => {
    setShowEndDialog(false)
    router.push("/")
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // If switching to code tab and we're at the right stage, update the stage
    if (value === "code" && currentStage === 1) {
      setCurrentStage(2)
    }
  }

  // Add a function to manually advance the interview stage for testing
  useEffect(() => {
    // This will ensure the progress bar moves even if the user doesn't interact
    if (interviewStarted) {
      const progressInterval = setInterval(() => {
        if (currentStage < interviewStages.length - 1) {
          setCurrentStage((prevStage) => {
            // Only advance if we haven't reached the end
            if (prevStage < interviewStages.length - 1) {
              return prevStage + 1
            }
            return prevStage
          })
        } else {
          clearInterval(progressInterval)
        }
      }, 15000) // Advance every 15 seconds

      return () => clearInterval(progressInterval)
    }
  }, [interviewStarted, currentStage, interviewStages.length])

  // Don't render the main content until client-side
  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="p-2 h-auto">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                <Image
                  src={job.companyLogo || "/placeholder.svg"}
                  alt={`${job.companyName} logo`}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-sm font-medium">{job.jobTitle} Interview</h1>
                <p className="text-xs text-muted-foreground">{job.companyName}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Interview Progress</span>
                <span className="font-medium">{interviewStages[currentStage]}</span>
              </div>
              <Progress value={interviewProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                {interviewStages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index <= currentStage ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Interview Timer */}
            {interviewStarted && (
              <InterviewTimer
                initialTime={60} // 60 seconds = 1 minute
                isActive={interviewStarted}
                onTimeEnd={() => setShowEndDialog(true)}
              />
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setShowPreparationTips(true)}>
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                    Tips
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Interview preparation tips</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setShowBackgroundSettings(true)}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Background
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change virtual background</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowEndDialog(true)}
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              End Interview
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className={`flex flex-1 ${fullscreenVideo ? "flex-col" : "flex-col md:flex-row"}`}>
        {/* Video section - hidden when code is fullscreen */}
        {!fullscreenCode && (
          <div className={`${fullscreenVideo ? "h-full w-full" : "h-[300px] md:h-auto md:w-1/2"} bg-black relative`}>
            <VideoSection
              videoEnabled={videoEnabled}
              micEnabled={micEnabled}
              stream={stream}
              fullscreenVideo={fullscreenVideo}
              interviewStarted={interviewStarted}
              onToggleFullscreen={() => setFullscreenVideo(!fullscreenVideo)}
              onToggleMic={toggleMic}
              onToggleVideo={toggleVideo}
            />
          </div>
        )}

        {/* Chat and code section */}
        {!fullscreenVideo && (
          <div className={`flex-1 flex flex-col h-full md:border-l ${fullscreenCode ? "w-full" : ""}`}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <span className="flex items-center gap-2">Chat</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <span className="flex items-center gap-2">Coding Challenge</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Chat tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col p-0 h-full">
                <InterviewChat messages={messages} onSendMessage={handleSendMessage} isTyping={isTyping} />
              </TabsContent>

              {/* Code tab */}
              <TabsContent value="code" className="flex-1 flex flex-col p-0 h-full">
                <CodingChallenge
                  challenges={codingChallenges}
                  programmingLanguages={programmingLanguages}
                  selectedChallenge={selectedChallenge}
                  selectedLanguage={selectedLanguage}
                  code={code}
                  codeOutput={codeOutput}
                  isRunningCode={isRunningCode}
                  fullscreenCode={fullscreenCode}
                  onSelectChallenge={handleSelectChallenge}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onResetCode={handleResetCode}
                  onToggleFullscreen={() => setFullscreenCode(!fullscreenCode)}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Camera Access Prompt */}
      <CameraPrompt
        open={showCameraPrompt}
        onOpenChange={setShowCameraPrompt}
        onEnableCamera={handleCameraRetry}
        cameraError={cameraError}
        retryCount={cameraRetryCount}
      />

      {/* Interview Tips Dialog */}
      <Dialog open={showPreparationTips} onOpenChange={setShowPreparationTips}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Interview Preparation Tips
            </DialogTitle>
            <DialogDescription>Follow these tips to improve your performance during the interview</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {interviewTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {tip.icon}
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowPreparationTips(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Background Settings Dialog */}
      <Dialog open={showBackgroundSettings} onOpenChange={setShowBackgroundSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Virtual Background</DialogTitle>
            <DialogDescription>Choose a virtual background for your video</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {virtualBackgrounds.map((bg) => (
              <div
                key={bg.id}
                className={`relative aspect-video rounded-md overflow-hidden border-2 cursor-pointer hover:opacity-90 transition-opacity ${
                  selectedBackground === bg.id ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedBackground(bg.id)}
              >
                {bg.url ? (
                  bg.url === "blur" ? (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Blur</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">{bg.name}</span>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">None</span>
                  </div>
                )}

                {selectedBackground === bg.id && (
                  <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackgroundSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowBackgroundSettings(false)}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Interview Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Interview</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this interview? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEndInterview}>
              End Interview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

