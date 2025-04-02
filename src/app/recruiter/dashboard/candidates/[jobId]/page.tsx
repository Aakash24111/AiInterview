"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Mail,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Calendar,
  MessageSquare,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecruiterLayout from "@/components/recruiter/layout"

// Sample job data
const jobData = {
  id: 1,
  title: "Frontend Developer",
  department: "Engineering",
  location: "Mumbai",
  type: "Full-time",
  applicants: 24,
  status: "active",
  datePosted: "2025-03-15",
}

// Sample candidates data
const candidatesData = [
  {
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
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 9876543211",
    experience: "2 years",
    status: "pending",
    interviewScore: null,
    codingScore: null,
    communicationScore: null,
    overallScore: null,
    appliedDate: "2025-03-19",
    interviewDate: "2025-03-22",
    resumeUrl: "#",
    avatar: "/placeholder.svg",
    notes: "",
    tags: ["JavaScript", "CSS", "HTML"],
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 9876543212",
    experience: "4 years",
    status: "interviewed",
    interviewScore: 72,
    codingScore: 68,
    communicationScore: 80,
    overallScore: 73,
    appliedDate: "2025-03-17",
    interviewDate: "2025-03-19",
    resumeUrl: "#",
    avatar: "/placeholder.svg",
    notes: "Good communication skills but needs to improve technical knowledge.",
    tags: ["React", "Redux", "Node.js"],
  },
  {
    id: 4,
    name: "Neha Singh",
    email: "neha.singh@example.com",
    phone: "+91 9876543213",
    experience: "1 year",
    status: "rejected",
    interviewScore: 45,
    codingScore: 40,
    communicationScore: 65,
    overallScore: 50,
    appliedDate: "2025-03-16",
    interviewDate: "2025-03-18",
    resumeUrl: "#",
    avatar: "/placeholder.svg",
    notes: "Lacks necessary technical skills for the position.",
    tags: ["HTML", "CSS", "jQuery"],
  },
  {
    id: 5,
    name: "Vikram Malhotra",
    email: "vikram.malhotra@example.com",
    phone: "+91 9876543214",
    experience: "5 years",
    status: "interviewed",
    interviewScore: 92,
    codingScore: 95,
    communicationScore: 88,
    overallScore: 92,
    appliedDate: "2025-03-15",
    interviewDate: "2025-03-17",
    resumeUrl: "#",
    avatar: "/placeholder.svg",
    notes: "Excellent candidate with strong technical skills and good communication.",
    tags: ["React", "TypeScript", "Next.js", "Node.js"],
  },
  {
    id: 6,
    name: "Ananya Desai",
    email: "ananya.desai@example.com",
    phone: "+91 9876543215",
    experience: "2 years",
    status: "pending",
    interviewScore: null,
    codingScore: null,
    communicationScore: null,
    overallScore: null,
    appliedDate: "2025-03-20",
    interviewDate: "2025-03-23",
    resumeUrl: "#",
    avatar: "/placeholder.svg",
    notes: "",
    tags: ["React", "CSS", "UI/UX"],
  },
]

export default function CandidatesPage({ params }: { params: { jobId: string } }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter candidates based on active tab and search query
  const filteredCandidates = candidatesData.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "interviewed") return candidate.status === "interviewed" && matchesSearch
    if (activeTab === "pending") return candidate.status === "pending" && matchesSearch
    if (activeTab === "rejected") return candidate.status === "rejected" && matchesSearch

    return matchesSearch
  })

  const getCandidateStatusBadge = (status: string) => {
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
      default:
        return null
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground"
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
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
              <h1 className="text-2xl font-bold">{jobData.title} - Candidates</h1>
              <p className="text-muted-foreground">{jobData.applicants} candidates applied for this position</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Email All
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Total Candidates</span>
                <span className="text-2xl font-bold">{candidatesData.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Interviewed</span>
                <span className="text-2xl font-bold text-blue-500">
                  {candidatesData.filter((c) => c.status === "interviewed").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="text-2xl font-bold text-yellow-500">
                  {candidatesData.filter((c) => c.status === "pending").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Average Score</span>
                <span className="text-2xl font-bold text-green-500">
                  {Math.round(
                    candidatesData
                      .filter((c) => c.overallScore !== null)
                      .reduce((acc, c) => acc + (c.overallScore || 0), 0) /
                      candidatesData.filter((c) => c.overallScore !== null).length,
                  )}
                  %
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Candidates</CardTitle>
            <CardDescription>Manage and review candidates who have applied for this position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search candidates..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="interviewed">Interviewed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button variant="ghost" className="p-0 font-medium flex items-center">
                        Candidate
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium flex items-center">
                        Score
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium flex items-center">
                        Applied Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={candidate.avatar} alt={candidate.name} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{candidate.name}</div>
                              <div className="text-sm text-muted-foreground">{candidate.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{candidate.experience}</TableCell>
                        <TableCell>{getCandidateStatusBadge(candidate.status)}</TableCell>
                        <TableCell>
                          {candidate.overallScore !== null ? (
                            <span className={`font-medium ${getScoreColor(candidate.overallScore)}`}>
                              {candidate.overallScore}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(candidate.appliedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {candidate.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {candidate.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => router.push(`/recruiter/dashboard/candidate/${candidate.id}`)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View Report
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Interview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                Mark as Hired
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Reject Candidate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No candidates found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RecruiterLayout>
  )
}

