"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FilterSectionProps {
  filters: {
    jobTypes: string[]
    locations: string[]
    experienceRange: [number, number]
    salaryRange: [number, number]
    skills: string[]
  }
  selectedFilters: {
    jobTypes: string[]
    locations: string[]
    experienceRange: [number, number]
    salaryRange: [number, number]
    skills: string[]
  }
  setSelectedFilters: (filters: any) => void
}

export default function FilterSection({ filters, selectedFilters, setSelectedFilters }: FilterSectionProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleJobType = (jobType: string) => {
    if (selectedFilters.jobTypes.includes(jobType)) {
      setSelectedFilters({
        ...selectedFilters,
        jobTypes: selectedFilters.jobTypes.filter((type) => type !== jobType),
      })
    } else {
      setSelectedFilters({
        ...selectedFilters,
        jobTypes: [...selectedFilters.jobTypes, jobType],
      })
    }
  }

  const toggleLocation = (location: string) => {
    if (selectedFilters.locations.includes(location)) {
      setSelectedFilters({
        ...selectedFilters,
        locations: selectedFilters.locations.filter((loc) => loc !== location),
      })
    } else {
      setSelectedFilters({
        ...selectedFilters,
        locations: [...selectedFilters.locations, location],
      })
    }
  }

  const toggleSkill = (skill: string) => {
    if (selectedFilters.skills.includes(skill)) {
      setSelectedFilters({
        ...selectedFilters,
        skills: selectedFilters.skills.filter((s) => s !== skill),
      })
    } else {
      setSelectedFilters({
        ...selectedFilters,
        skills: [...selectedFilters.skills, skill],
      })
    }
  }

  const updateExperienceRange = (value: number[]) => {
    setSelectedFilters({
      ...selectedFilters,
      experienceRange: [value[0], value[1]],
    })
  }

  const updateSalaryRange = (value: number[]) => {
    setSelectedFilters({
      ...selectedFilters,
      salaryRange: [value[0], value[1]],
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      jobTypes: [],
      locations: [],
      experienceRange: [0, 15],
      salaryRange: [0, 100],
      skills: [],
    })
  }

  const formatSalary = (value: number) => {
    return `₹${value},000`
  }

  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden w-full mb-4">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          Filters
          <ChevronDown className={`h-4 w-4 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Filter section - responsive */}
      <div className={`${mobileFiltersOpen ? "block" : "hidden"} md:block space-y-6`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Filters</h3>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>

        {/* Selected filters */}
        {(selectedFilters.jobTypes.length > 0 ||
          selectedFilters.locations.length > 0 ||
          selectedFilters.skills.length > 0) && (
          <div className="flex flex-wrap gap-2 my-4">
            {selectedFilters.jobTypes.map((type) => (
              <Badge key={type} variant="secondary" className="cursor-pointer" onClick={() => toggleJobType(type)}>
                {type} ×
              </Badge>
            ))}
            {selectedFilters.locations.map((location) => (
              <Badge
                key={location}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleLocation(location)}
              >
                {location} ×
              </Badge>
            ))}
            {selectedFilters.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => toggleSkill(skill)}>
                {skill} ×
              </Badge>
            ))}
          </div>
        )}

        <Accordion type="multiple" defaultValue={["job-type", "location", "experience", "salary", "skills"]}>
          {/* Job Type Filter */}
          <AccordionItem value="job-type">
            <AccordionTrigger>Job Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {filters.jobTypes.map((jobType) => (
                  <div key={jobType} className="flex items-center">
                    <Button
                      variant="ghost"
                      className="justify-start h-8 px-2 w-full"
                      onClick={() => toggleJobType(jobType)}
                    >
                      <div className="w-4 h-4 border rounded-sm mr-2 flex items-center justify-center">
                        {selectedFilters.jobTypes.includes(jobType) && <Check className="h-3 w-3" />}
                      </div>
                      {jobType}
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Location Filter */}
          <AccordionItem value="location">
            <AccordionTrigger>Location</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {filters.locations.map((location) => (
                  <div key={location} className="flex items-center">
                    <Button
                      variant="ghost"
                      className="justify-start h-8 px-2 w-full"
                      onClick={() => toggleLocation(location)}
                    >
                      <div className="w-4 h-4 border rounded-sm mr-2 flex items-center justify-center">
                        {selectedFilters.locations.includes(location) && <Check className="h-3 w-3" />}
                      </div>
                      {location}
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Experience Range Filter */}
          <AccordionItem value="experience">
            <AccordionTrigger>Experience</AccordionTrigger>
            <AccordionContent>
              <div className="px-2 pt-4 pb-2">
                <Slider
                  defaultValue={[0, 15]}
                  min={0}
                  max={15}
                  step={1}
                  value={[selectedFilters.experienceRange[0], selectedFilters.experienceRange[1]]}
                  onValueChange={updateExperienceRange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{selectedFilters.experienceRange[0]} years</span>
                  <span>{selectedFilters.experienceRange[1]} years</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Salary Range Filter */}
          <AccordionItem value="salary">
            <AccordionTrigger>Salary</AccordionTrigger>
            <AccordionContent>
              <div className="px-2 pt-4 pb-2">
                <Slider
                  defaultValue={[0, 100]}
                  min={0}
                  max={100}
                  step={5}
                  value={[selectedFilters.salaryRange[0], selectedFilters.salaryRange[1]]}
                  onValueChange={updateSalaryRange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{formatSalary(selectedFilters.salaryRange[0])}</span>
                  <span>{formatSalary(selectedFilters.salaryRange[1])}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Skills Filter */}
          <AccordionItem value="skills">
            <AccordionTrigger>Skills</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {filters.skills.map((skill) => (
                  <div key={skill} className="flex items-center">
                    <Button
                      variant="ghost"
                      className="justify-start h-8 px-2 w-full"
                      onClick={() => toggleSkill(skill)}
                    >
                      <div className="w-4 h-4 border rounded-sm mr-2 flex items-center justify-center">
                        {selectedFilters.skills.includes(skill) && <Check className="h-3 w-3" />}
                      </div>
                      {skill}
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  )
}

