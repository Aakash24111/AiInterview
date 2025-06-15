"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/search-bar";
import FilterSection from "@/components/filter-section";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

// Define interfaces for better type safety
interface Job {
  jobId: number;
  jobTitle: string;
  department: string;
  location: string;
  jobType: string;
  experienceRequired: string;
  salaryRange: string;
  applicationDeadline: string;
  createdAt: string;
  status: string;
  teamSize: string;
  tags: string[];
  remoteWorkAvailable: boolean;
  urgentHiring: boolean;
  publishImmediately: boolean;
  jobDescription: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  interviewProcess: string;
  companyId: number;
   company_name: string;
}

interface FilterOptions {
  jobTypes: string[];
  locations: string[];
  experienceRange: [number, number];
  salaryRange: [number, number];
  skills: string[];
}

interface SelectedFilters {
  jobTypes: string[];
  locations: string[];
  experienceRange: [number, number];
  salaryRange: [number, number];
  skills: string[];
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    jobTypes: [],
    locations: [],
    experienceRange: [0, 15],
    salaryRange: [0, 10000000],
    skills: [],
  });
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    jobTypes: [],
    locations: [],
    experienceRange: [0, 15],
    salaryRange: [0, 10000000],
    skills: [],
  });

  // Fetch jobs data dynamically
  useEffect(() => {
  async function fetchJobsWithCompanyNames() {
    try {
      // Step 1: Get token
      const tokenResponse = await fetch("http://127.0.0.1:8000/user/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "user", password: "user" }),
      });

      if (!tokenResponse.ok) throw new Error("Failed to get token");

      const token = await tokenResponse.text();

      // Step 2: Fetch jobs
      const jobResponse = await fetch("http://localhost:8001/job_service/getJobs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!jobResponse.ok) throw new Error("Failed to fetch jobs");

      const jobs = await jobResponse.json();

      // Step 3: Fetch company details with token
      const jobsWithCompanyNames = await Promise.all(
        jobs.map(async (job: any) => {
          try {
            const companyResponse = await fetch(
              `http://localhost:8002/company/companyDetails/${job.companyId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!companyResponse.ok) throw new Error("Failed to fetch company");

            const companyData = await companyResponse.json();

            return {
              ...job,
              company_name: companyData.companyName, // Use actual name
            };
          } catch (err) {
            console.error(`Error fetching company ${job.companyId}:`, err);
            return {
              ...job,
              company_name: "Unknown Company", // Fallback
            };
          }
        })
      );

      // Set to state
      setJobsData(jobsWithCompanyNames);
    } catch (err) {
      console.error("Error fetching jobs or companies:", err);
    }
  }

  fetchJobsWithCompanyNames();
}, []);


  // Filtering logic (unchanged)
  useEffect(() => {
  let result = jobsData;

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (job) =>
        job.tags.some((tag) => tag.toLowerCase().includes(query)) || // ✅ use tags
        job.jobDescription.toLowerCase().includes(query)
    );
  }

  if (selectedFilters.jobTypes.length > 0) {
    result = result.filter((job) => selectedFilters.jobTypes.includes(job.jobType));
  }

  if (selectedFilters.locations.length > 0) {
    result = result.filter((job) => selectedFilters.locations.includes(job.location));
  }

  result = result.filter((job) => {
    const minExp = extractNumber(job.experienceRequired);
    return minExp >= selectedFilters.experienceRange[0] && minExp <= selectedFilters.experienceRange[1];
  });

  result = result.filter((job) => {
    const minSalary = extractNumber(job.salaryRange);
    return minSalary >= selectedFilters.salaryRange[0] && minSalary <= selectedFilters.salaryRange[1];
  });

  if (selectedFilters.skills.length > 0) {
    result = result.filter((job) =>
      selectedFilters.skills.some((skill) =>
        job.tags.some((tag) => tag.toLowerCase().includes(skill.toLowerCase()))
      )
    );
  }

  setFilteredJobs(result);
}, [searchQuery, selectedFilters, jobsData]);

  // Function to extract numeric values from experience and salary fields
  function extractNumber(value: string | number): number {
    if (typeof value === "number") return value; // If it's already a number, return it
    if (typeof value === "string") {
      const numbers = value.match(/\d+/g);
      return numbers ? Number.parseInt(numbers[0]) : 0;
    }
    return 0; // Default to 0 if the value is neither string nor number
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterSection
              filters={filters}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          </div>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium">{filteredJobs.length} Jobs Available</h2>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.jobId}
                    id={job.jobId}
                    jobTitle={job.jobTitle}
                    companyName={`Company ${job.company_name}`}
                    experience={job.experienceRequired}
                    salary={job.salaryRange}
                    jobType={job.jobType}
                    location={job.location}
                    tags={job.tags}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
