"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Job {
  job_id: number;
  job_roles: string;
  job_location: string;
  job_type: string;
  salary: string;
  experience: string;
  company_id: number;
  job_description: string;
  posted_date: string;
  application_deadline: string;
  about_company: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  team_size: string;
  interview_process: string;
  company_name: string;
  job_title: string;
  tags:string[];
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
if (!params?.slug) return;

async function fetchJobDetails() {
  try {
    const jobId = params.slug;

    // Step 1: Get token
    const token = localStorage.getItem("userToken");
    if (!token) throw new Error("User token not found in localStorage");

    // Step 2: Fetch job
    const jobResponse = await fetch(`http://localhost:8001/job_service/getJobById/${jobId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!jobResponse.ok) throw new Error("Failed to fetch job");

    const rawData = await jobResponse.json();

    // Step 3: Fetch company name
    if (rawData.companyId) {
try {
  const companyResponse = await fetch(
    `http://localhost:8002/company/companyDetails/${rawData.companyId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (companyResponse.ok) {
    const companyData = await companyResponse.json();
    rawData.company_name = companyData.companyName;
    rawData.about_company = companyData.companyDescription;
  } else {
    rawData.company_name = "Unknown Company";
    rawData.about_company = "No details provided";
  }
} catch (err) {
  rawData.company_name = "Unknown Company";
  rawData.about_company = "No details provided";
}
}


    // Step 4: Transform job
    const transformedJob: Job = {
      job_id: rawData.jobId,
      job_title: rawData.jobTitle,
      job_location: rawData.location,
      job_type: rawData.jobType.charAt(0).toUpperCase() + rawData.jobType.slice(1),
      salary: `${rawData.salaryRange.toLocaleString()}`,
      experience: `${rawData.experienceRequired} years`,
      application_deadline: rawData.applicationDeadline,
      posted_date: rawData.createdAt,
      team_size: rawData.teamSize,
      tags: rawData.tags,
      job_description: rawData.jobDescription,
      responsibilities: rawData.responsibilities
  ? rawData.responsibilities.split(", ").filter(Boolean)
  : [],

requirements: rawData.requirements
  ? rawData.requirements.split(", ").filter(Boolean)
  : [],

benefits: rawData.benefits
  ? rawData.benefits.split(",").map((b: string) => b.trim())
  : [],
      interview_process:rawData.interviewProcess.replace(/->|→/g, " → "),

      company_id: rawData.companyId,
      company_name: rawData.company_name,
      about_company: rawData.about_company,
    };

    setJob(transformedJob);
  } catch (err) {
    console.error("Error fetching job or company details:", err);
    setError(true);
  } finally {
    setLoading(false);
  }
}

fetchJobDetails();
}, [params?.slug]);



  const handleProceedToInterview = () => {
    if (job) {
      router.push(`/interview/${job.job_id}`)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <h3 className="text-lg font-medium mb-2">Job not found</h3>
          <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/")}>View All Jobs</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
    <Button variant="ghost" onClick={() => router.back()} className="mb-6">
      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
    </Button>

    {/* Job Header */}
    <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{job.job_title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Building className="h-3 w-3" /> {job.company_name}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {job.job_location}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {job.job_type}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> {job.salary}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" /> {job.experience}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.map((tag: string) => (
              <Badge key={tag.trim()} variant="secondary" className="font-normal">
              {tag.trim()}
              </Badge>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Posted: {job.posted_date}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Apply by: {job.application_deadline}
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <Button size="lg" onClick={handleProceedToInterview}>
            Proceed to Interview
          </Button>
        </div>
      </div>
    </div>

    {/* Job Details */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* About Company */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">About {job.company_name}</h2>
            <p className="text-muted-foreground">{job.about_company}</p>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="text-muted-foreground mb-6">{job.job_description}</p>

            <h3 className="text-lg font-medium mb-3">Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              {job.responsibilities.map((item: string, index: number) => (
                <li key={index} className="text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-medium mb-3">Requirements</h3>
            <ul className="list-disc pl-5 space-y-2">
              {job.requirements.map((item: string, index: number) => (
                <li key={index} className="text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Interview Process */}
        <Card>
          <CardContent className="p-6">
                          <h2 className="text-xl font-semibold mb-4">Interview Process</h2>
<ol className="space-y-4">
{job.interview_process.split(/→|,/).map((step: string, index: number) => (
  <li key={index} className="flex items-start gap-3">
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
      {index + 1}
    </div>
    <div className="text-muted-foreground">{step.trim().replace(/\.$/, "")}</div>
  </li>
))}
</ol>

          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Job Summary */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Job Summary</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{job.experience}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="font-medium">{job.salary}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{job.job_location}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Job Type</p>
                  <p className="font-medium">{job.job_type}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="font-medium">{job.team_size}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Application Deadline</p>
                  <p className="font-medium">{job.application_deadline}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Benefits</h2>
            <ul className="space-y-3">
              {job.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Apply Button */}
        <Button size="lg" className="w-full" onClick={handleProceedToInterview}>
          Proceed to Interview
        </Button>
      </div>
    </div>
  </div>
)
}