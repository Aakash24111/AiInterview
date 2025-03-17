// import JobCard from "@/components/JobCard"
// export default function Home() {
//   return (
//     <div className="grid grid-col-1 sm:grid-cols-1 xl:grid-cols-3 h-screen justify-center items-start gap-6 p-10 ">
//       <JobCard
//         companyLogo="/google.png"
//         jobTitle="Frontend Developer"
//         companyName="Google"
//         experience="2-3 Years"
//         salary="₹20,000 - ₹30,000"
//         jobType="Full-time"
//         location="Mumbai"
//         tags={["Frontend", "Full-time", "React", "Remote", "Mumbai"]}
//       />
//       <JobCard
//         companyLogo="/microsoft.png"
//         jobTitle="Backend Developer"
//         companyName="Microsoft"
//         experience="7-8 years"
//         salary="₹50,000 - ₹60,000"
//         jobType="Full-time"
//         location="Mumbai"
//         tags={["Backend", "Full-time", "Java", "Remote", "Mumbai"]}
//       />
//       <JobCard
//         companyLogo="/amazon.png"
//         jobTitle="Full Stack Developer"
//         companyName="Amazon"
//         experience="2-3 Years"
//         salary="₹20,000 - ₹30,000"
//         jobType="Full-time"
//         location="Mumbai"
//         tags={["Frontend", "Full-time", "React", "Remote", "Mumbai"]}
//       />
//     </div>
//   );
// }


"use client"

import { useState, useEffect } from "react"
import JobCard from "@/components/JobCard"
import SearchBar from "@/components/search-bar"
import FilterSection from "@/components/filter-section"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"


const jobsData = [
  {
    id: 1,
    companyLogo: "/google.png",
    jobTitle: "Frontend Developer",
    companyName: "Google",
    experience: "2-3 Years",
    salary: "₹20,000 - ₹30,000",
    jobType: "Full-time",
    location: "Mumbai",
    tags: ["Frontend", "React", "JavaScript", "Remote"],
  },
  {
    id: 2,
    companyLogo: "/microsoft.png",
    jobTitle: "Backend Developer",
    companyName: "Microsoft",
    experience: "7-8 years",
    salary: "₹50,000 - ₹60,000",
    jobType: "Full-time",
    location: "Mumbai",
    tags: ["Backend", "Java", "Spring", "Remote"],
  },
  {
    id: 3,
    companyLogo: "/amazon.png",
    jobTitle: "Full Stack Developer",
    companyName: "Amazon",
    experience: "2-3 Years",
    salary: "₹20,000 - ₹30,000",
    jobType: "Full-time",
    location: "Mumbai",
    tags: ["Frontend", "Backend", "React", "Node.js", "Remote"],
  },
  {
    id: 4,
    companyLogo: "/facebook.png",
    jobTitle: "UI/UX Designer",
    companyName: "Facebook",
    experience: "3-5 Years",
    salary: "₹40,000 - ₹50,000",
    jobType: "Contract",
    location: "Bangalore",
    tags: ["UI", "UX", "Figma", "Adobe XD", "Hybrid"],
  },
  {
    id: 5,
    companyLogo: "/netflix.png",
    jobTitle: "DevOps Engineer",
    companyName: "Netflix",
    experience: "4-6 Years",
    salary: "₹60,000 - ₹80,000",
    jobType: "Part-time",
    location: "Delhi",
    tags: ["DevOps", "AWS", "Docker", "Kubernetes", "On-site"],
  },
  {
    id: 6,
    companyLogo: "/iq.jpg",
    jobTitle: "iOS Developer",
    companyName: "Apple",
    experience: "5-7 Years",
    salary: "₹70,000 - ₹90,000",
    jobType: "Full-time",
    location: "Hyderabad",
    tags: ["iOS", "Swift", "Objective-C", "Remote"],
  },
]

// Extract unique filter options
const extractFilters = (): {
  jobTypes: string[];
  locations: string[];
  experienceRange: [number, number]; // ✅ Ensure it's a tuple
  salaryRange: [number, number]; // ✅ Ensure it's a tuple
  skills: string[];
} => {
  const jobTypes = Array.from(new Set(jobsData.map((job) => job.jobType)));
  const locations = Array.from(new Set(jobsData.map((job) => job.location)));
  const skills = Array.from(new Set(jobsData.flatMap((job) => job.tags)));

  return {
    jobTypes,
    locations,
    experienceRange: [0, 15] as [number, number], // ✅ Explicit tuple
    salaryRange: [0, 100] as [number, number], // ✅ Explicit tuple
    skills,
  };
};


export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState(extractFilters())
  const [selectedFilters, setSelectedFilters] = useState<{
    jobTypes: string[];
    locations: string[];
    experienceRange: [number, number]; 
    salaryRange: [number, number]; 
    skills: string[];
  }>({
    jobTypes: [],
    locations: [],
    experienceRange: [0, 15],
    salaryRange: [0, 100], 
    skills: [],
  });  
  const [filteredJobs, setFilteredJobs] = useState(jobsData)

  // Filter jobs based on search query and selected filters
  useEffect(() => {
    let result = jobsData

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Filter by job type
    if (selectedFilters.jobTypes.length > 0) {
      result = result.filter((job) => selectedFilters.jobTypes.includes(job.jobType))
    }

    // Filter by location
    if (selectedFilters.locations.length > 0) {
      result = result.filter((job) => selectedFilters.locations.includes(job.location))
    }

    // Filter by experience
    result = result.filter((job) => {
      const expRange = job.experience.match(/\d+/g)
      if (expRange && expRange.length >= 1) {
        const minExp = Number.parseInt(expRange[0])
        return minExp >= selectedFilters.experienceRange[0] && minExp <= selectedFilters.experienceRange[1]
      }
      return true
    })

    // Filter by salary
    result = result.filter((job) => {
      const salaryRange = job.salary.match(/\d+/g)
      if (salaryRange && salaryRange.length >= 1) {
        const minSalary = Number.parseInt(salaryRange[0])
        return minSalary >= selectedFilters.salaryRange[0] && minSalary <= selectedFilters.salaryRange[1]
      }
      return true
    })

    // Filter by skills
    if (selectedFilters.skills.length > 0) {
      result = result.filter((job) => selectedFilters.skills.some((skill) => job.tags.includes(skill)))
    }

    setFilteredJobs(result)
  }, [searchQuery, selectedFilters])

  return (
    <main className="min-h-screen bg-background">

      {/* Main content */}
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Search bar */}
        <div className="mb-8">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterSection
              filters={filters}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          </div>

          {/* Job listings */}
          <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
  <h2 className="text-lg font-medium">{filteredJobs.length} Jobs Available</h2>
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">Sort by:</span>
    <select
      className="text-sm border rounded-md px-2 py-1 transition-all
        bg-white text-black border-gray-300 
        dark:bg-gray-800 dark:text-white dark:border-gray-600"
    >
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

