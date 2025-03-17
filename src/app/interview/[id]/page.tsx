"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Send,
  Code,
  Maximize2,
  Minimize2,
  MoreVertical,
  PhoneOff,
  CheckCircle,
  Expand,
  Loader2,
  Lightbulb,
  ThumbsUp,
  Smile,
  Frown,
  Meh,
  Zap,
  Coffee,
  Brain,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

// Add this type definition at the top of the file, after the imports
type CodeLanguage = "javascript" | "python" | "java" | "cpp" | "csharp" | "ruby" | "go" | "typescript"

type InitialCode = {
  [key in CodeLanguage]: string
}

type CodingChallenge = {
  id: number
  title: string
  description: string
  difficulty: string
  initialCode: InitialCode
  testCases: any[]
}

// Sample job data - in a real app, you would fetch this from an API
const jobsData = [
  {
    id: 1,
    companyLogo: "/google.png",
    jobTitle: "Frontend Developer",
    companyName: "Google",
    experience: "2-3 Years",
    salary: "₹20,000 - ₹30,000",
    jobType: "Full-time",
    location: "Mumbai",
    tags: ["Frontend", "React", "JavaScript", "Remote"],
  },
  {
    id: 2,
    companyLogo: "/microsoft.png",
    jobTitle: "Backend Developer",
    companyName: "Microsoft",
    experience: "7-8 years",
    salary: "₹50,000 - ₹60,000",
    jobType: "Full-time",
    location: "Mumbai",
    tags: ["Backend", "Java", "Spring", "Remote"],
  },
  {
    id: 3,
    companyLogo: "/amazon.png",
    jobTitle: "Full Stack Developer",
    companyName: "Amazon",
    experience: "2-3 Years",
    salary: "₹20,000 - ₹30,000",
    jobType: "Full-time",
    location: "Mumbai",
    tags: ["Frontend", "Backend", "React", "Node.js", "Remote"],
  },
  {
    id: 4,
    companyLogo: "/facebook.png",
    jobTitle: "UI/UX Designer",
    companyName: "Facebook",
    experience: "3-5 Years",
    salary: "₹40,000 - ₹50,000",
    jobType: "Contract",
    location: "Bangalore",
    tags: ["UI", "UX", "Figma", "Adobe XD", "Hybrid"],
  },
  {
    id: 5,
    companyLogo: "/netflix.png",
    jobTitle: "DevOps Engineer",
    companyName: "Netflix",
    experience: "4-6 Years",
    salary: "₹60,000 - ₹80,000",
    jobType: "Part-time",
    location: "Delhi",
    tags: ["DevOps", "AWS", "Docker", "Kubernetes", "On-site"],
  },
  {
    id: 6,
    companyLogo: "/apple.png",
    jobTitle: "iOS Developer",
    companyName: "Apple",
    experience: "5-7 Years",
    salary: "₹70,000 - ₹90,000",
    jobType: "Full-time",
    location: "Hyderabad",
    tags: ["iOS", "Swift", "Objective-C", "Remote"],
  },
]

// Sample chat messages
const initialMessages = [
  {
    id: 1,
    sender: "interviewer",
    message: "Hello! Welcome to your interview for the position. How are you doing today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 2,
    sender: "candidate",
    message: "Hi! I'm doing well, thank you for asking. I'm excited for this interview opportunity.",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 3,
    sender: "interviewer",
    message: "Great! Let's start with a brief introduction. Could you tell me about yourself and your experience?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
]

// Programming languages
const programmingLanguages = [
  { id: "javascript", name: "JavaScript", icon: "JS" },
  { id: "python", name: "Python", icon: "PY" },
  { id: "java", name: "Java", icon: "JV" },
  { id: "cpp", name: "C++", icon: "C++" },
  { id: "csharp", name: "C#", icon: "C#" },
  { id: "ruby", name: "Ruby", icon: "RB" },
  { id: "go", name: "Go", icon: "GO" },
  { id: "typescript", name: "TypeScript", icon: "TS" },
]

// Sample coding challenges with multiple language support
const codingChallenges = [
  {
    id: 1,
    title: "Reverse a String",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    difficulty: "Easy",
    initialCode: {
      javascript: "function reverseString(str) {\n  // Your code here\n  \n}",
      python: "def reverse_string(s):\n    # Your code here\n    \n",
      java: "public class Solution {\n    public String reverseString(String s) {\n        // Your code here\n        \n    }\n}",
      cpp: "#include <string>\n\nclass Solution {\npublic:\n    std::string reverseString(std::string s) {\n        // Your code here\n        \n    }\n};",
      csharp:
        "public class Solution {\n    public string ReverseString(string s) {\n        // Your code here\n        \n    }\n}",
      ruby: "def reverse_string(s)\n  # Your code here\n  \nend",
      go: "func reverseString(s string) string {\n    // Your code here\n    \n}",
      typescript: "function reverseString(str: string): string {\n  // Your code here\n  \n}",
    },
    testCases: [
      { input: "hello", expected: "olleh" },
      { input: "world", expected: "dlrow" },
    ],
  },
  {
    id: 2,
    title: "FizzBuzz",
    description:
      "Write a function that returns 'Fizz' for numbers divisible by 3, 'Buzz' for numbers divisible by 5, and 'FizzBuzz' for numbers divisible by both 3 and 5. Otherwise, return the number itself.",
    difficulty: "Easy",
    initialCode: {
      javascript: "function fizzBuzz(n) {\n  // Your code here\n  \n}",
      python: "def fizz_buzz(n):\n    # Your code here\n    \n",
      java: "public class Solution {\n    public String fizzBuzz(int n) {\n        // Your code here\n        \n    }\n}",
      cpp: "class Solution {\npublic:\n    std::string fizzBuzz(int n) {\n        // Your code here\n        \n    }\n};",
      csharp:
        "public class Solution {\n    public string FizzBuzz(int n) {\n        // Your code here\n        \n    }\n}",
      ruby: "def fizz_buzz(n)\n  # Your code here\n  \nend",
      go: "func fizzBuzz(n int) string {\n    // Your code here\n    \n}",
      typescript: "function fizzBuzz(n: number): string {\n  // Your code here\n  \n}",
    },
    testCases: [
      { input: 3, expected: "Fizz" },
      { input: 5, expected: "Buzz" },
      { input: 15, expected: "FizzBuzz" },
      { input: 7, expected: "7" },
    ],
  },
  {
    id: 3,
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Medium",
    initialCode: {
      javascript: "function twoSum(nums, target) {\n  // Your code here\n  \n}",
      python: "def two_sum(nums, target):\n    # Your code here\n    \n",
      java: "public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        \n    }\n}",
      cpp: "class Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Your code here\n        \n    }\n};",
      csharp:
        "public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        // Your code here\n        \n    }\n}",
      ruby: "def two_sum(nums, target)\n  # Your code here\n  \nend",
      go: "func twoSum(nums []int, target int) []int {\n    // Your code here\n    \n}",
      typescript: "function twoSum(nums: number[], target: number): number[] {\n  // Your code here\n  \n}",
    },
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
    ],
  },
  {
    id: 4,
    title: "Valid Palindrome",
    description:
      "Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
    difficulty: "Easy",
    initialCode: {
      javascript: "function isPalindrome(s) {\n  // Your code here\n  \n}",
      python: "def is_palindrome(s):\n    # Your code here\n    \n",
      java: "public class Solution {\n    public boolean isPalindrome(String s) {\n        // Your code here\n        \n    }\n}",
      cpp: "class Solution {\npublic:\n    bool isPalindrome(std::string s) {\n        // Your code here\n        \n    }\n};",
      csharp:
        "public class Solution {\n    public bool IsPalindrome(string s) {\n        // Your code here\n        \n    }\n}",
      ruby: "def is_palindrome(s)\n  # Your code here\n  \nend",
      go: "func isPalindrome(s string) bool {\n    // Your code here\n    \n}",
      typescript: "function isPalindrome(s: string): boolean {\n  // Your code here\n  \n}",
    },
    testCases: [
      { input: "A man, a plan, a canal: Panama", expected: true },
      { input: "race a car", expected: false },
    ],
  },
]

// Interview stages
const interviewStages = ["Introduction", "Technical Questions", "Coding Challenge", "Behavioral Questions", "Q&A"]

// Interview tips
const interviewTips = [
  {
    title: "Prepare Your Environment",
    description: "Ensure you have a quiet space with good lighting and a stable internet connection.",
    icon: <Coffee className="h-5 w-5" />,
  },
  {
    title: "Research the Company",
    description: "Understand the company's products, culture, and recent news before the interview.",
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    title: "Practice Common Questions",
    description: "Prepare answers for common technical and behavioral questions in your field.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: "Show Your Problem-Solving",
    description: "Think aloud during coding challenges to demonstrate your thought process.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Ask Thoughtful Questions",
    description: "Prepare questions about the role, team, and company to show your interest.",
    icon: <Sparkles className="h-5 w-5" />,
  },
]

// Virtual backgrounds
const virtualBackgrounds = [
  { id: "none", name: "None", url: null },
  { id: "office", name: "Office", url: "/backgrounds/office.jpg" },
  { id: "bookshelf", name: "Bookshelf", url: "/backgrounds/bookshelf.jpg" },
  { id: "nature", name: "Nature", url: "/backgrounds/nature.jpg" },
  { id: "tech", name: "Tech Space", url: "/backgrounds/tech.jpg" },
  { id: "blur", name: "Blur", url: "blur" },
]

export default function InterviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge>(codingChallenges[0])
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
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
  const [confidenceScore, setConfidenceScore] = useState(75)
  const [selectedBackground, setSelectedBackground] = useState("none")
  const [showBackgroundSettings, setShowBackgroundSettings] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)

  // Initialize video stream
  useEffect(() => {
    if (!loading && job) {
      initializeCamera()
    }
  }, [loading, job])

  // Initialize camera
  const initializeCamera = async () => {
    try {
      // Only try to access camera if we're in a browser environment
      if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera access is not available in this environment.")
        setVideoEnabled(false)
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
            throw new Error("Camera permission denied. You can proceed with the interview without camera.")
          }
          throw err // Re-throw other errors
        })

      setStream(newStream)

      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }

      // Reset video enabled state if we successfully got the stream
      setVideoEnabled(true)
      setCameraError(null)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setVideoEnabled(false)

      // Set a more user-friendly error message
      if (err instanceof Error) {
        setCameraError(err.message)
      } else {
        setCameraError("Could not access camera. You can proceed with the interview without camera.")
      }
    }
  }

  useEffect(() => {
    // Only run on client side and after a user interaction
    if (typeof window !== "undefined" && !loading && job) {
      // Don't automatically try to initialize camera
      // Instead, set a default state that shows a "Start Camera" button
      setVideoEnabled(false)
      setCameraError("Click 'Enable Camera' below to start your camera for the interview.")
    }
  }, [loading, job])

  // Add this new function to handle camera initialization after user interaction
  const handleEnableCamera = () => {
    setCameraError(null)
    initializeCamera()
  }

  useEffect(() => {
    // In a real app, you would fetch the job details from an API
    const jobId = Number.parseInt(params.id)
    const foundJob = jobsData.find((job) => job.id === jobId)

    if (foundJob) {
      setJob(foundJob)
    }

    setLoading(false)

    return () => {
      // Clean up video stream when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [params.id])

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update interview progress based on current stage
  useEffect(() => {
    setInterviewProgress((currentStage + 1) * 20)
  }, [currentStage])

  // Simulate confidence score changes
  useEffect(() => {
    const interval = setInterval(() => {
      setConfidenceScore((prev) => {
        const change = Math.floor(Math.random() * 7) - 3 // Random change between -3 and +3
        const newScore = Math.max(30, Math.min(95, prev + change))
        return newScore
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Toggle microphone
  const toggleMic = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !micEnabled
      })
      setMicEnabled(!micEnabled)
    }
  }

  // Toggle video
  const toggleVideo = async () => {
    if (!videoEnabled) {
      // If video is currently disabled, try to enable it
      handleEnableCamera()
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

        if (videoRef.current) {
          videoRef.current.srcObject = null
        }

        setVideoEnabled(false)
        setCameraError("Camera turned off. Click 'Enable Camera' to turn it back on.")
      }
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg = {
      id: messages.length + 1,
      sender: "candidate",
      message: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Simulate interviewer typing
    setIsTyping(true)

    // Simulate interviewer response after a delay
    setTimeout(() => {
      setIsTyping(false)

      const response = {
        id: messages.length + 2,
        sender: "interviewer",
        message:
          "Thank you for your response. Let me ask you another question. What are your strengths and weaknesses as a developer?",
        timestamp: new Date().toISOString(),
      }

      setMessages((prevMessages) => [...prevMessages, response])

      // Advance to next stage if appropriate
      if (currentStage < interviewStages.length - 1 && Math.random() > 0.7) {
        setCurrentStage(currentStage + 1)
      }
    }, 3000)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

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
  const handleSelectChallenge = (challenge: CodingChallenge) => {
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
            const response = {
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

  const getConfidenceEmoji = () => {
    if (confidenceScore >= 80) return <ThumbsUp className="h-4 w-4 text-green-500" />
    if (confidenceScore >= 60) return <Smile className="h-4 w-4 text-blue-500" />
    if (confidenceScore >= 40) return <Meh className="h-4 w-4 text-yellow-500" />
    return <Frown className="h-4 w-4 text-red-500" />
  }

  const getConfidenceColor = () => {
    if (confidenceScore >= 80) return "bg-green-500"
    if (confidenceScore >= 60) return "bg-blue-500"
    if (confidenceScore >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Setting up your interview...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <h3 className="text-lg font-medium mb-2">Interview not found</h3>
          <p className="text-muted-foreground mb-4">
            The interview you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/")}>View All Jobs</Button>
        </div>
      </div>
    )
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
                    <Image src="/placeholder.svg" alt="Background" width={16} height={16} className="h-4 w-4 mr-2" />
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
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-sm">
                  AI Interviewer
                </div>
              </div>

              {/* Candidate */}
              <div className="w-1/2 h-full relative flex items-center justify-center">
                {videoEnabled && stream ? (
                  <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gray-800 flex flex-col items-center justify-center p-4">
                    <div className="h-20 w-20 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                      <span className="text-2xl text-gray-400">You</span>
                    </div>

                    {cameraError && (
                      <>
                        <p className="text-white text-center text-sm mb-4">{cameraError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEnableCamera}
                          className="bg-primary/20 hover:bg-primary/30 text-white"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Enable Camera
                        </Button>
                      </>
                    )}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-sm">
                  You (Candidate)
                </div>
                {!videoEnabled && stream && (
                  <div className="absolute top-4 right-4 bg-red-500 p-1 rounded-full">
                    <VideoOff className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Confidence meter */}
                <div
                  key="confidence-meter"
                  className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                >
                  <span>Confidence:</span>
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${getConfidenceColor()}`} style={{ width: `${confidenceScore}%` }}></div>
                  </div>
                  {getConfidenceEmoji()}
                </div>
              </div>
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
                      onClick={toggleMic}
                    >
                      {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{micEnabled ? "Mute your microphone" : "Unmute your microphone"}</p>
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
                      onClick={toggleVideo}
                    >
                      {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{videoEnabled ? "Turn off your camera" : "Turn on your camera"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-white"
                      onClick={() => setFullscreenVideo(!fullscreenVideo)}
                    >
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
        )}

        {/* Chat and code section */}
        {!fullscreenVideo && (
          <div className={`flex-1 flex flex-col h-full md:border-l ${fullscreenCode ? "w-full" : ""}`}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Coding Challenge
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Chat tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col p-0 h-full">
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-4 flex ${msg.sender === "interviewer" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "interviewer"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm">{msg.message}</span>
                          <span suppressHydrationWarning className="text-xs opacity-70 mt-1 text-right">
                            {formatTime(msg.timestamp)}
                          </span>
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
                <div className="p-4 border-t sticky bottom-0 bg-background">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[60px]"
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
              </TabsContent>

              {/* Code tab */}
              <TabsContent value="code" className="flex-1 flex flex-col p-0 h-full">
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{selectedChallenge.title}</h3>
                        <Badge
                          variant={
                            selectedChallenge.difficulty === "Easy"
                              ? "outline"
                              : selectedChallenge.difficulty === "Medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {selectedChallenge.difficulty}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Select Challenge <MoreVertical className="h-4 w-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {codingChallenges.map((challenge) => (
                              <DropdownMenuItem key={challenge.id} onClick={() => handleSelectChallenge(challenge)}>
                                <span className="mr-2">{challenge.title}</span>
                                <Badge
                                  variant={
                                    challenge.difficulty === "Easy"
                                      ? "outline"
                                      : challenge.difficulty === "Medium"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className="ml-auto"
                                >
                                  {challenge.difficulty}
                                </Badge>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{selectedChallenge.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {programmingLanguages.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              <div className="flex items-center gap-2">
                                <span className="bg-muted px-1 rounded text-xs font-mono">{lang.icon}</span>
                                <span>{lang.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button variant="ghost" size="icon" onClick={() => setFullscreenCode(!fullscreenCode)}>
                        {fullscreenCode ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col md:flex-row">
                    <div className="flex-1 p-4 bg-muted/30 overflow-auto">
                      <div className="bg-background border rounded-md h-full flex flex-col">
                        <div className="p-2 border-b bg-muted/50 text-sm font-medium flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-muted px-1 rounded text-xs font-mono">
                              {programmingLanguages.find((lang) => lang.id === selectedLanguage)?.icon}
                            </span>
                            <span>{programmingLanguages.find((lang) => lang.id === selectedLanguage)?.name}</span>
                          </div>
                        </div>
                        <textarea
                          ref={codeEditorRef}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
                          spellCheck="false"
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-80 border-t md:border-t-0 md:border-l flex flex-col">
                      <div className="p-2 border-b bg-muted/50 text-sm font-medium">Test Cases</div>
                      <div className="p-4 overflow-y-auto flex-1">
                        <ul className="space-y-3">
                          {selectedChallenge.testCases.map((testCase: any, index: number) => (
                            <li key={index} className="text-sm">
                              <div className="font-medium">Test {index + 1}:</div>
                              <div className="mt-1 space-y-1">
                                <div>
                                  <span className="text-muted-foreground">Input: </span>
                                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                    {typeof testCase.input === "object"
                                      ? JSON.stringify(testCase.input)
                                      : testCase.input}
                                  </code>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Expected: </span>
                                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                    {JSON.stringify(testCase.expected)}
                                  </code>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {codeOutput && (
                        <div className="border-t">
                          <div className="p-2 border-b bg-muted/50 text-sm font-medium">Output</div>
                          <pre className="p-4 text-xs font-mono overflow-auto max-h-[200px] whitespace-pre-wrap">
                            {codeOutput}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t sticky bottom-0 bg-background flex justify-between">
                    <Button variant="outline" onClick={handleResetCode}>
                      Reset Code
                    </Button>
                    <Button onClick={handleRunCode} disabled={isRunningCode}>
                      {isRunningCode ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        "Run Tests"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

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
              <Card key={index}>
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
                className={`relative aspect-video rounded-md overflow-hidden border-2 cursor-pointer ${
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

