import type React from "react"
export type CodeLanguage = "javascript" | "python" | "java" | "cpp" | "csharp" | "ruby" | "go" | "typescript"

export type InitialCode = {
  [key in CodeLanguage]: string
}

export type CodingChallenge = {
  id: number
  title: string
  description: string
  difficulty: string
  initialCode: InitialCode
  testCases: any[]
}

export type InterviewMessage = {
  id: number
  sender: "interviewer" | "candidate"
  message: string
  timestamp: string
}

export type Job = {
  id: number
  companyLogo: string
  jobTitle: string
  companyName: string
  experience: string
  salary: string
  jobType: string
  location: string
  tags: string[]
}

export type FaceAnalysisResult = {
  confidence: number
  attention: number
  cheating: boolean
  emotions: {
    happy: number
    neutral: number
    anxious: number
  }
}

export type ProgrammingLanguage = {
  id: CodeLanguage
  name: string
  icon: string
}

export type VirtualBackground = {
  id: string
  name: string
  url: string | null
}

export type InterviewTip = {
  title: string
  description: string
  icon: React.ReactNode
}

