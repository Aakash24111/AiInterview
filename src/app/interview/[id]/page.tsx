"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth"
import AuthGuard from "@/components/AuthGuard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import InterviewComponent from "@/components/interview/InterviewComponent"
import type { Job } from "@/components/interview/types"

export default function InterviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  // Client-side only code
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    async function fetchJobAndCompany() {
      try {
        const token = getToken()
        if (!token) throw new Error("User token not found")

        const jobId = params.id

        // Fetch job details
        const jobRes = await fetch(`http://localhost:8001/job_service/getJobById/${jobId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        if (!jobRes.ok) throw new Error("Failed to fetch job")
        const raw = await jobRes.json()

        // Optionally fetch company
        let companyName = "Unknown Company"
        try {
          if (raw.companyId) {
            const companyRes = await fetch(`http://localhost:8002/company/companyDetails/${raw.companyId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            if (companyRes.ok) {
              const company = await companyRes.json()
              companyName = company.companyName || companyName
            }
          }
        } catch {
          // ignore company fetch errors
        }

        const mapped: Job = {
          id: raw.jobId,
          companyLogo: "/placeholder.svg",
          jobTitle: raw.jobTitle,
          companyName: companyName,
          experience: `${raw.experienceRequired} years`,
          salary: `${raw.salaryRange}`,
          jobType: raw.jobType?.charAt(0).toUpperCase() + raw.jobType?.slice(1),
          location: raw.location,
          tags: Array.isArray(raw.tags) ? raw.tags : (typeof raw.tags === "string" ? raw.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
        }

        setJob(mapped)
      } catch (e) {
        console.error("Error setting up interview:", e)
        setJob(null)
      } finally {
        setLoading(false)
      }
    }

    fetchJobAndCompany()
  }, [params.id])

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

  // Don't render the main content until client-side
  if (!isMounted) {
    return null
  }

  return (
    <AuthGuard requireAuth={true} allowedRoles={['USER', 'CANDIDATE']}>
      <InterviewComponent job={job} />
    </AuthGuard>
  )
}

 