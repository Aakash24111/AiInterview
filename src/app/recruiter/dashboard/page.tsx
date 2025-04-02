"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  Users,
  BarChart3,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import RecruiterLayout from "@/components/recruiter/layout"

// Sample data for jobs
const jobsData = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Mumbai",
    type: "Full-time",
    applicants: 24,
    status: "active",
    datePosted: "2025-03-15",
  },
  {
    id: 2,
    title: "Backend Developer",
    department: "Engineering",
    location: "Mumbai",
    type: "Full-time",
    applicants: 18,
    status: "active",
    datePosted: "2025-03-10",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    department: "Design",
    location: "Bangalore",
    type: "Contract",
    applicants: 12,
    status: "active",
    datePosted: "2025-03-05",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Operations",
    location: "Delhi",
    type: "Part-time",
    applicants: 8,
    status: "closed",
    datePosted: "2025-02-20",
  },
  {
    id: 5,
    title: "iOS Developer",
    department: "Mobile",
    location: "Hyderabad",
    type: "Full-time",
    applicants: 15,
    status: "draft",
    datePosted: "2025-03-18",
  },
  {
    id: 6,
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Mumbai",
    type: "Full-time",
    applicants: 30,
    status: "active",
    datePosted: "2025-03-01",
  },
]

// Sample data for recent candidates
const recentCandidatesData = [
  {
    id: 1,
    name: "Rahul Sharma",
    position: "Frontend Developer",
    status: "interviewed",
    score: 85,
    date: "2025-03-20",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Priya Patel",
    position: "Backend Developer",
    status: "pending",
    score: null,
    date: "2025-03-22",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Amit Kumar",
    position: "UI/UX Designer",
    status: "interviewed",
    score: 72,
    date: "2025-03-19",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Neha Singh",
    position: "Full Stack Developer",
    status: "rejected",
    score: 45,
    date: "2025-03-18",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Vikram Malhotra",
    position: "Frontend Developer",
    status: "interviewed",
    score: 92,
    date: "2025-03-17",
    avatar: "/placeholder.svg",
  },
]

export default function RecruiterDashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [totalJobs, setTotalJobs] = useState(jobsData.length)

  // Filter jobs based on active tab and search query
  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return job.status === "active" && matchesSearch
    if (activeTab === "draft") return job.status === "draft" && matchesSearch
    if (activeTab === "closed") return job.status === "closed" && matchesSearch

    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "closed":
        return <Badge variant="secondary">Closed</Badge>
      default:
        return null
    }
  }

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

  return (
    <RecruiterLayout>
      <div className="flex flex-col gap-6">
        {/* Dashboard header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">Manage your job listings and candidates</p>
          </div>
          <Button onClick={() => router.push("/recruiter/dashboard/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Job
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                <p className="text-3xl font-bold">{totalJobs}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
                <p className="text-3xl font-bold">{jobsData.reduce((acc, job) => acc + job.applicants, 0)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interviews This Week</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Interview Score</p>
                <p className="text-3xl font-bold">78%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job listings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>Manage your active, draft, and closed job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search jobs..."
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
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <Button variant="ghost" className="p-0 font-medium flex items-center">
                        Job Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium flex items-center">
                        Applicants
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium flex items-center">
                        Date Posted
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell>
                          <Link
                            href={`/recruiter/dashboard/candidates/${job.id}`}
                            className="text-primary hover:underline"
                          >
                            {job.applicants}
                          </Link>
                        </TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>
                          {new Date(job.datePosted).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          })}
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
                                onClick={() => router.push(`/recruiter/dashboard/candidates/${job.id}`)}
                              >
                                <Users className="mr-2 h-4 w-4" />
                                View Candidates
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/recruiter/dashboard/edit/${job.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Job
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/job/${job.title.toLowerCase().replace(/ /g, "-")}-company`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No jobs found. Try adjusting your search or create a new job.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent candidates */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Candidates</CardTitle>
            <CardDescription>Latest candidates who have applied or completed interviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCandidatesData.map((candidate) => (
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
                          <div className="font-medium">{candidate.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.position}</TableCell>
                      <TableCell>{getCandidateStatusBadge(candidate.status)}</TableCell>
                      <TableCell>
                        {candidate.score !== null ? (
                          <span
                            className={`font-medium ${
                              candidate.score >= 80
                                ? "text-green-500"
                                : candidate.score >= 60
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          >
                            {candidate.score}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(candidate.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/recruiter/dashboard/candidate/${candidate.id}`)}
                        >
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RecruiterLayout>
  )
}

