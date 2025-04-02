"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import InterviewComponent from "@/components/interview/InterviewComponent"
import { jobsData } from "@/components/interview/data"
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
    // In a real app, you would fetch the job details from an API
    const jobId = Number.parseInt(params.id)
    const foundJob = jobsData.find((job) => job.id === jobId)

    if (foundJob) {
      setJob(foundJob)
    }

    setLoading(false)
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

  return <InterviewComponent job={job} />
}

