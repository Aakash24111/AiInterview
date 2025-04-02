"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/search-bar";
import FilterSection from "@/components/filter-section";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

// Define interfaces for better type safety
interface Job {
  job_id: number;
  job_roles: string;
  job_location: string;
  job_type: string;
  salary: string;
  experience: string;
  company_name: string;
  job_description: string;
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
    async function fetchJobs() {
      try {
        const response = await fetch("http://127.0.0.1:8000/job/job_services/?skip=0&limit=10");
        const data: Job[] = await response.json();

        setJobsData(data);
        setFilteredJobs(data);

        // Extract unique filter values
        setFilters({
          jobTypes: Array.from(new Set(data.map((job) => job.job_type))),
          locations: Array.from(new Set(data.map((job) => job.job_location))),
          experienceRange: [0, Math.max(...data.map((job) => extractNumber(job.experience)), 15)],
          salaryRange: [0, Math.max(...data.map((job) => extractNumber(job.salary)), 10000000)],
          skills: Array.from(new Set(data.flatMap((job) => job.job_roles.split(", ")))),
        });
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    }

    fetchJobs();
  }, []);

  // Filtering logic (unchanged)
  useEffect(() => {
    let result = jobsData;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.job_roles.toLowerCase().includes(query) ||
          job.job_description.toLowerCase().includes(query)
      );
    }

    if (selectedFilters.jobTypes.length > 0) {
      result = result.filter((job) => selectedFilters.jobTypes.includes(job.job_type));
    }

    if (selectedFilters.locations.length > 0) {
      result = result.filter((job) => selectedFilters.locations.includes(job.job_location));
    }

    result = result.filter((job) => {
      const minExp = extractNumber(job.experience);
      return minExp >= selectedFilters.experienceRange[0] && minExp <= selectedFilters.experienceRange[1];
    });

    result = result.filter((job) => {
      const minSalary = extractNumber(job.salary);
      return minSalary >= selectedFilters.salaryRange[0] && minSalary <= selectedFilters.salaryRange[1];
    });

    if (selectedFilters.skills.length > 0) {
      result = result.filter((job) =>
        selectedFilters.skills.some((skill) => job.job_roles.includes(skill))
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
                    key={job.job_id}
                    id={job.job_id}
                    jobTitle={job.job_title}
                    companyName={`Company ${job.company_name}`}
                    experience={`${job.experience} years`}
                    salary={`$${job.salary}`}
                    jobType={job.job_type}
                    location={job.job_location}
                    tags={job.job_roles ? job.job_roles.split(", ").map((role) => role.trim()) : []}
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
