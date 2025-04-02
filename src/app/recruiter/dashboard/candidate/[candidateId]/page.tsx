"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Video,
  Code,
  AlertTriangle,
  Clock,
  Eye,
  Smile,
  Frown,
  Brain,
  Download,
  Edit,
  Save,
  Briefcase,
  Meh,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import RecruiterLayout from "@/components/recruiter/layout"

// Add dialog for Hire and Reject buttons
// Add these imports at the top
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Sample candidate data
const candidateData = {
  id: 1,
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 9876543210",
  experience: "3 years",
  status: "interviewed",
  interviewScore: 85,
  codingScore: 92,
  communicationScore: 78,
  overallScore: 85,
  appliedDate: "2025-03-18",
  interviewDate: "2025-03-20",
  resumeUrl: "#",
  avatar: "/placeholder.svg",
  notes: "Strong React skills, good problem-solving abilities. Could improve communication slightly.",
  tags: ["React", "TypeScript", "Frontend"],
  position: "Frontend Developer",
  company: "Your Company",
  location: "Mumbai",
  jobType: "Full-time",
  interviewDuration: "45 minutes",
  interviewReport: {
    summary:
      "Rahul performed well in the interview, demonstrating strong technical knowledge and problem-solving skills. He showed proficiency in React and TypeScript, and was able to articulate his thoughts clearly. There were some areas where he could improve, particularly in communication and explaining complex concepts.",
    strengths: [
      "Strong technical knowledge of React and frontend technologies",
      "Good problem-solving approach",
      "Clear understanding of modern JavaScript concepts",
      "Experience with TypeScript and state management",
      "Attention to detail in code quality",
    ],
    weaknesses: [
      "Could improve communication of complex technical concepts",
      "Limited experience with backend technologies",
      "Some hesitation when discussing system design",
    ],
    codingChallenge: {
      title: "Reverse a String",
      description: "Write a function that reverses a string. The input string is given as an array of characters.",
      performance:
        "Completed the challenge efficiently with optimal time complexity. Used a clean approach with good variable naming and comments.",
      code: `function reverseString(str) {
  // Handle edge cases
  if (!str || str.length <= 1) {
    return str;
  }
  
  // Use array methods for clean implementation
  return str.split('').reverse().join('');
}`,
      timeToComplete: "3 minutes",
      testsPassed: "2/2",
    },
    questions: [
      {
        question: "Explain the virtual DOM in React and how it improves performance.",
        answer:
          "The virtual DOM is a lightweight copy of the actual DOM that React maintains in memory. When state changes occur, React first updates the virtual DOM, then compares it with the previous version (diffing), and finally only updates the actual DOM with the necessary changes. This approach is more efficient than directly manipulating the DOM for every change, as DOM operations are expensive. The virtual DOM allows React to batch updates and minimize actual DOM manipulations, resulting in better performance.",
        score: 90,
      },
      {
        question: "How would you optimize a React application for performance?",
        answer:
          "I would use several techniques: 1) Implement React.memo for functional components and PureComponent for class components to prevent unnecessary re-renders, 2) Use the useCallback and useMemo hooks to memoize functions and computed values, 3) Implement code splitting with React.lazy and Suspense to reduce initial bundle size, 4) Optimize images and assets, 5) Use windowing or virtualization for long lists with libraries like react-window, 6) Implement proper key props for lists, and 7) Analyze and optimize render cycles using the React DevTools profiler.",
        score: 85,
      },
      {
        question: "Describe your experience with state management in React.",
        answer:
          "I've worked with various state management approaches in React. For simpler applications, I use React's built-in useState and useContext hooks. For more complex applications, I've used Redux for global state management, particularly when dealing with complex state that's shared across many components. I've also worked with Redux Toolkit to simplify Redux boilerplate. Recently, I've been exploring Recoil for some projects, which provides a more flexible approach with atoms and selectors. I choose the state management solution based on the project's complexity and requirements.",
        score: 80,
      },
    ],
    faceAnalysis: {
      confidence: 85,
      attention: 90,
      emotions: {
        happy: 60,
        neutral: 30,
        anxious: 10,
      },
      suspiciousActivities: [
        {
          timestamp: "00:12:45",
          description: "Looking away from camera briefly",
          severity: "low",
        },
        {
          timestamp: "00:28:30",
          description: "Possible reference to notes",
          severity: "medium",
        },
      ],
    },
  },
}

export default function CandidateReport({ params }: { params: { candidateId: string } }) {
  const router = useRouter()
  const [notes, setNotes] = useState(candidateData.notes)
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  // Add these state variables inside the component
  const [showHireDialog, setShowHireDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [candidateStatus, setCandidateStatus] = useState(candidateData.status)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Update the getStatusBadge function to include the "hired" status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "interviewed":
        return <Badge className="bg-blue-500">Interviewed</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-500">
            Rejected
          </Badge>
        )
      case "hired":
        return <Badge className="bg-green-500">Hired</Badge>
      default:
        return null
    }
  }

  return (
    <RecruiterLayout>
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Candidate Report</h1>
              <p className="text-muted-foreground">Detailed interview report and analysis</p>
            </div>
          </div>
          {/* Replace the buttons in the page header with these updated buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Follow-up
            </Button>
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-500"
              onClick={() => setShowRejectDialog(true)}
              disabled={candidateStatus === "rejected"}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={() => setShowHireDialog(true)} disabled={candidateStatus === "hired"}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Hire
            </Button>
          </div>
        </div>

        {/* Candidate overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidate profile */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={candidateData.avatar} alt={candidateData.name} />
                  <AvatarFallback className="text-2xl">
                    {candidateData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{candidateData.name}</h2>
                <p className="text-muted-foreground mb-2">{candidateData.position}</p>
                {getStatusBadge(candidateStatus)}

                <Separator className="my-4" />

                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidateData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidateData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidateData.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Applied: {new Date(candidateData.appliedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Interviewed: {new Date(candidateData.interviewDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-2 justify-center">
                  {candidateData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Recruiter Notes</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditingNotes(!isEditingNotes)}>
                      {isEditingNotes ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </Button>
                  </div>

                  {isEditingNotes ? (
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[100px]" />
                  ) : (
                    <p className="text-sm text-muted-foreground text-left">{notes || "No notes added yet."}</p>
                  )}
                </div>

                <div className="w-full mt-4">
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Resume
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview scores */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Interview Performance</CardTitle>
              <CardDescription>
                Overall score:{" "}
                <span className={`font-medium ${getScoreColor(candidateData.overallScore)}`}>
                  {candidateData.overallScore}%
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Technical Knowledge</span>
                    <span className={getScoreColor(candidateData.interviewScore)}>{candidateData.interviewScore}%</span>
                  </div>
                  <Progress
                    value={candidateData.interviewScore}
                    className={`h-2 ${getScoreBackground(candidateData.interviewScore)}`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coding Skills</span>
                    <span className={getScoreColor(candidateData.codingScore)}>{candidateData.codingScore}%</span>
                  </div>
                  <Progress
                    value={candidateData.codingScore}
                    className={`h-2 ${getScoreBackground(candidateData.codingScore)}`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Communication</span>
                    <span className={getScoreColor(candidateData.communicationScore)}>
                      {candidateData.communicationScore}%
                    </span>
                  </div>
                  <Progress
                    value={candidateData.communicationScore}
                    className={`h-2 ${getScoreBackground(candidateData.communicationScore)}`}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Interview Summary</h3>
                <p className="text-sm text-muted-foreground">{candidateData.interviewReport.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Strengths</h3>
                  <ul className="space-y-1">
                    {candidateData.interviewReport.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Areas for Improvement</h3>
                  <ul className="space-y-1">
                    {candidateData.interviewReport.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Interview Duration: {candidateData.interviewDuration}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed analysis */}
        <Tabs defaultValue="questions">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Interview Questions</span>
            </TabsTrigger>
            <TabsTrigger value="coding" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Coding Challenge</span>
            </TabsTrigger>
            <TabsTrigger value="face" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Face Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Interview Recording</span>
            </TabsTrigger>
          </TabsList>

          {/* Interview Questions */}
          <TabsContent value="questions" className="space-y-4 pt-4">
            {candidateData.interviewReport.questions.map((q, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Question {index + 1}</CardTitle>
                    <Badge className={getScoreBackground(q.score)}>{q.score}%</Badge>
                  </div>
                  <CardDescription>{q.question}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm border-l-2 border-muted pl-4 py-2 italic">{q.answer}</div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Coding Challenge */}
          <TabsContent value="coding" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{candidateData.interviewReport.codingChallenge.title}</CardTitle>
                <CardDescription>{candidateData.interviewReport.codingChallenge.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre>{candidateData.interviewReport.codingChallenge.code}</pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Time to Complete</span>
                    <span className="text-sm text-muted-foreground">
                      {candidateData.interviewReport.codingChallenge.timeToComplete}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Tests Passed</span>
                    <span className="text-sm text-green-500">
                      {candidateData.interviewReport.codingChallenge.testsPassed}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Performance</span>
                    <span className="text-sm text-muted-foreground">Excellent</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    {candidateData.interviewReport.codingChallenge.performance}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Face Analysis */}
          <TabsContent value="face" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Face Analysis</CardTitle>
                <CardDescription>
                  AI-powered analysis of candidate's facial expressions and behavior during interview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`h-16 w-16 rounded-full ${getScoreBackground(candidateData.interviewReport.faceAnalysis.confidence)} flex items-center justify-center mb-2`}
                        >
                          <span className="text-white text-xl font-bold">
                            {candidateData.interviewReport.faceAnalysis.confidence}%
                          </span>
                        </div>
                        <h3 className="font-medium">Confidence</h3>
                        <p className="text-sm text-muted-foreground">Overall confidence level during interview</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`h-16 w-16 rounded-full ${getScoreBackground(candidateData.interviewReport.faceAnalysis.attention)} flex items-center justify-center mb-2`}
                        >
                          <span className="text-white text-xl font-bold">
                            {candidateData.interviewReport.faceAnalysis.attention}%
                          </span>
                        </div>
                        <h3 className="font-medium">Attention</h3>
                        <p className="text-sm text-muted-foreground">Focus and engagement during interview</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex gap-2 mb-2">
                          <Smile className="h-6 w-6 text-green-500" />
                          <Meh className="h-6 w-6 text-yellow-500" />
                          <Frown className="h-6 w-6 text-red-500" />
                        </div>
                        <h3 className="font-medium">Emotions</h3>
                        <div className="w-full mt-2 space-y-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Happy</span>
                              <span>{candidateData.interviewReport.faceAnalysis.emotions.happy}%</span>
                            </div>
                            <Progress
                              value={candidateData.interviewReport.faceAnalysis.emotions.happy}
                              className="h-1 bg-green-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Neutral</span>
                              <span>{candidateData.interviewReport.faceAnalysis.emotions.neutral}%</span>
                            </div>
                            <Progress
                              value={candidateData.interviewReport.faceAnalysis.emotions.neutral}
                              className="h-1 bg-blue-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Anxious</span>
                              <span>{candidateData.interviewReport.faceAnalysis.emotions.anxious}%</span>
                            </div>
                            <Progress
                              value={candidateData.interviewReport.faceAnalysis.emotions.anxious}
                              className="h-1 bg-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-3">Suspicious Activities</h3>
                  {candidateData.interviewReport.faceAnalysis.suspiciousActivities.length > 0 ? (
                    <div className="space-y-2">
                      {candidateData.interviewReport.faceAnalysis.suspiciousActivities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
                          <AlertTriangle
                            className={`h-5 w-5 flex-shrink-0 ${
                              activity.severity === "high"
                                ? "text-red-500"
                                : activity.severity === "medium"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{activity.timestamp}</span>
                              <Badge
                                variant="outline"
                                className={`
                                ${
                                  activity.severity === "high"
                                    ? "border-red-500 text-red-500"
                                    : activity.severity === "medium"
                                      ? "border-yellow-500 text-yellow-500"
                                      : "border-blue-500 text-blue-500"
                                }
                              `}
                              >
                                {activity.severity} severity
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No suspicious activities detected during the interview.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interview Recording */}
          <TabsContent value="video" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Recording</CardTitle>
                <CardDescription>Full video recording of the interview session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interview recording available</p>
                    <Button className="mt-4">
                      <Play className="mr-2 h-4 w-4" />
                      Play Recording
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Key Moments</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 border rounded-md">
                        <span className="text-sm font-medium">00:05:30</span>
                        <span className="text-sm text-muted-foreground">Discussion about React experience</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded-md">
                        <span className="text-sm font-medium">00:12:45</span>
                        <span className="text-sm text-muted-foreground">Technical question about virtual DOM</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 border rounded-md">
                        <span className="text-sm font-medium">00:28:30</span>
                        <span className="text-sm text-muted-foreground">Coding challenge explanation</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Download Options</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Download Full Recording (MP4)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="mr-2 h-4 w-4" />
                        Download Audio Only (MP3)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Download Transcript (PDF)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Hire Dialog */}
        <AlertDialog open={showHireDialog} onOpenChange={setShowHireDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hire Candidate</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to hire {candidateData.name}? This will mark the candidate as hired and notify
                them.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setCandidateStatus("hired")
                  // In a real app, you would update the database here
                  router.refresh()
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirm Hire
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Dialog */}
        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Candidate</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject {candidateData.name}? This will mark the candidate as rejected and
                notify them.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setCandidateStatus("rejected")
                  // In a real app, you would update the database here
                  router.refresh()
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Rejection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RecruiterLayout>
  )
}

