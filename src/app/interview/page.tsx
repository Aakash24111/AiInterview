"use client"

import { useState, useEffect } from "react"
import JobCard from "@/components/JobCard"
import SearchBar from "@/components/search-bar"
import FilterSection from "@/components/filter-section"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import { jobsData } from "@/components/interview/data" 

// Define interfaces for better type safety
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

// Extract unique filter options
const extractFilters = (): FilterOptions => {
  const jobTypes = Array.from(new Set(jobsData.map((job) => job.jobType)));
  const locations = Array.from(new Set(jobsData.map((job) => job.location)));
  const skills = Array.from(new Set(jobsData.flatMap((job) => job.tags)));

  return {
    jobTypes,
    locations,
    experienceRange: [0, 15] as [number, number], 
    salaryRange: [0, 100] as [number, number], 
    skills,
  };
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>(extractFilters())
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    jobTypes: [] as string[],
    locations: [] as string[],
    experienceRange: [0, 15] as [number, number],
    salaryRange: [0, 100] as [number, number],
    skills: [] as string[],
  });  
  const [filteredJobs, setFilteredJobs] = useState(jobsData)

  // Filter jobs based on search query and selected filters
  useEffect(() => {
    let result = jobsData

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    if (selectedFilters.jobTypes.length > 0) {
      result = result.filter((job) => selectedFilters.jobTypes.includes(job.jobType))
    }

    if (selectedFilters.locations.length > 0) {
      result = result.filter((job) => selectedFilters.locations.includes(job.location))
    }

    result = result.filter((job) => {
      const expRange = job.experience.match(/\d+/g)
      if (expRange && expRange.length >= 1) {
        const minExp = Number.parseInt(expRange[0])
        return minExp >= selectedFilters.experienceRange[0] && minExp <= selectedFilters.experienceRange[1]
      }
      return true
    })

    result = result.filter((job) => {
      const salaryRange = job.salary.match(/\d+/g)
      if (salaryRange && salaryRange.length >= 1) {
        const minSalary = Number.parseInt(salaryRange[0])
        return minSalary >= selectedFilters.salaryRange[0] && minSalary <= selectedFilters.salaryRange[1]
      }
      return true
    })

    if (selectedFilters.skills.length > 0) {
      result = result.filter((job) => selectedFilters.skills.some((skill) => job.tags.includes(skill)))
    }

    setFilteredJobs(result)
  }, [searchQuery, selectedFilters])

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
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="text-sm border rounded-md px-2 py-1 transition-all bg-white text-black border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600">
                  <option className="dark:bg-gray-900 dark:text-white">Relevance</option>
                  <option className="dark:bg-gray-900 dark:text-white">Latest</option>
                  <option className="dark:bg-gray-900 dark:text-white">Salary: High to Low</option>
                  <option className="dark:bg-gray-900 dark:text-white">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    companyLogo={job.companyLogo}
                    jobTitle={job.jobTitle}
                    companyName={job.companyName}
                    experience={job.experience}
                    salary={job.salary}
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
  )
}