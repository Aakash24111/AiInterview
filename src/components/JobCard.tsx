"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"

interface JobCardProps {
  id: number
  companyLogo: string
  jobTitle: string
  companyName: string
  experience: string
  salary: string
  jobType: string
  location: string
  tags: string[]
  isBookmarked?: boolean
  onBookmark?: (id: number) => void
}

export default function JobCard({
  id,
  companyLogo,
  jobTitle,
  companyName,
  experience,
  salary,
  jobType,
  location,
  tags,
  isBookmarked,
  onBookmark,
}: JobCardProps) {
  return (
    <Card className="overflow-hidden border border-border hover:shadow-md transition-all flex flex-col h-full">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
            <Image
              src={companyLogo || "/placeholder.svg"}
              alt={`${companyName} logo`}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{jobTitle}</h3>
            <p className="text-muted-foreground">{companyName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Experience</span>
            <span className="text-sm font-medium">{experience}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Salary</span>
            <span className="text-sm font-medium">{salary}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Job Type</span>
            <span className="text-sm font-medium">{jobType}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Location</span>
            <span className="text-sm font-medium">{location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3 flex flex-col gap-3 mt-auto">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="icon"
            className={`flex-shrink-0 ${isBookmarked ? "text-blue-500" : "text-muted-foreground"}`}
            onClick={() => onBookmark && onBookmark(id)}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-blue-500" : ""}`} />
          </Button>
          <Button variant="default" className="w-full" asChild>
            <a
              href={`/job/${encodeURIComponent(jobTitle.toLowerCase().replace(/ /g, "-"))}-${companyName.toLowerCase().replace(/ /g, "-")}`}
            >
              View Details
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

