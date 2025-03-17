"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Building, MapPin, Clock, DollarSign, Briefcase, Calendar, CheckCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Sample job data - in a real app, you would fetch this from an API
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
    postedDate: "2 weeks ago",
    applicationDeadline: "30 April 2025",
    aboutCompany:
      "Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.",
    jobDescription:
      "We are looking for a Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our web applications. The ideal candidate should have experience with React and modern JavaScript.",
    responsibilities: [
      "Develop new user-facing features using React.js",
      "Build reusable components and front-end libraries for future use",
      "Translate designs and wireframes into high-quality code",
      "Optimize components for maximum performance across a vast array of web-capable devices and browsers",
      "Coordinate with various teams working on different layers of the infrastructure",
    ],
    requirements: [
      "2-3 years of experience in frontend development",
      "Proficiency in JavaScript, HTML, CSS",
      "Experience with React.js and its core principles",
      "Familiarity with RESTful APIs",
      "Knowledge of modern authorization mechanisms, such as JSON Web Token",
      "Experience with common front-end development tools such as Babel, Webpack, NPM, etc.",
      "Good understanding of asynchronous request handling, partial page updates, and AJAX",
    ],
    benefits: [
      "Competitive salary package",
      "Flexible work hours",
      "Remote work options",
      "Health insurance",
      "Paid time off",
      "Professional development opportunities",
    ],
    teamSize: "10-15 members",
    interviewProcess:
      "1. Initial screening call\n2. Technical assessment\n3. Technical interview\n4. Culture fit interview\n5. Final decision",
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
    postedDate: "1 week ago",
    applicationDeadline: "15 May 2025",
    aboutCompany:
      "Microsoft Corporation is an American multinational technology corporation that produces computer software, consumer electronics, personal computers, and related services.",
    jobDescription:
      "We are seeking an experienced Backend Developer to design, develop and maintain server-side applications. The ideal candidate will have strong experience with Java and Spring framework.",
    responsibilities: [
      "Design and implement robust, scalable, and secure server-side applications",
      "Write clean, maintainable, and efficient code",
      "Participate in the entire application lifecycle, focusing on coding and debugging",
      "Collaborate with front-end developers to integrate user-facing elements with server-side logic",
      "Optimize applications for maximum speed and scalability",
    ],
    requirements: [
      "7-8 years of experience in backend development",
      "Proficiency in Java and Spring framework",
      "Experience with database design and optimization",
      "Knowledge of RESTful API design principles",
      "Understanding of server-side templating languages",
      "Familiarity with cloud services (AWS, Azure, or GCP)",
      "Experience with version control systems (Git)",
    ],
    benefits: [
      "Competitive salary package",
      "Performance bonuses",
      "Health and dental insurance",
      "Retirement plans",
      "Paid time off",
      "Professional development budget",
    ],
    teamSize: "15-20 members",
    interviewProcess:
      "1. HR screening\n2. Technical assessment\n3. Technical interview with team lead\n4. System design interview\n5. Culture fit interview\n6. Final decision",
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
    postedDate: "3 days ago",
    applicationDeadline: "10 May 2025",
    aboutCompany:
      "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    jobDescription:
      "We are looking for a Full Stack Developer who is passionate about building user-friendly web applications. You will be responsible for developing and maintaining both front-end and back-end components of our web applications.",
    responsibilities: [
      "Develop front-end website architecture using React.js",
      "Design and develop APIs using Node.js",
      "Build reusable code and libraries for future use",
      "Implement security and data protection measures",
      "Optimize applications for maximum speed and scalability",
      "Collaborate with other team members and stakeholders",
    ],
    requirements: [
      "2-3 years of experience in full stack development",
      "Proficiency in JavaScript, HTML, CSS",
      "Experience with React.js and Node.js",
      "Familiarity with database technology such as MongoDB, MySQL",
      "Understanding of RESTful API design",
      "Knowledge of version control tools like Git",
      "Good problem-solving skills and attention to detail",
    ],
    benefits: [
      "Competitive salary",
      "Stock options",
      "Health insurance",
      "Flexible work hours",
      "Remote work options",
      "Professional development opportunities",
      "Employee discount",
    ],
    teamSize: "8-10 members",
    interviewProcess:
      "1. Initial phone screening\n2. Technical assessment\n3. Technical interview\n4. System design interview\n5. Behavioral interview\n6. Final decision",
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
    postedDate: "1 week ago",
    applicationDeadline: "20 May 2025",
    aboutCompany:
      "Facebook, Inc. is an American social media conglomerate corporation. It is one of the world's most valuable companies and is considered one of the Big Five companies in the U.S. information technology industry.",
    jobDescription:
      "We are looking for a UI/UX Designer to turn our software into easy-to-use products for our clients. You will be responsible for creating intuitive and visually appealing user interfaces for our web and mobile applications.",
    responsibilities: [
      "Gather and evaluate user requirements in collaboration with product managers and engineers",
      "Illustrate design ideas using storyboards, process flows, and sitemaps",
      "Design graphic user interface elements, like menus, tabs, and widgets",
      "Build page navigation buttons and search fields",
      "Develop UI mockups and prototypes that clearly illustrate how sites function and look like",
      "Create original graphic designs (e.g. images, sketches, and tables)",
    ],
    requirements: [
      "3-5 years of experience in UI/UX design",
      "Proficiency in design software such as Figma, Adobe XD, or Sketch",
      "Understanding of interaction design principles",
      "Knowledge of wireframing tools",
      "Portfolio of design projects",
      "Up-to-date knowledge of design trends, techniques, and technologies",
      "Team spirit; strong communication skills to collaborate with various stakeholders",
    ],
    benefits: [
      "Competitive compensation",
      "Health and wellness benefits",
      "Flexible work arrangements",
      "Professional development opportunities",
      "Creative work environment",
      "Collaborative team culture",
    ],
    teamSize: "5-8 members",
    interviewProcess:
      "1. Portfolio review\n2. Initial interview\n3. Design challenge\n4. Team interview\n5. Final interview with design lead\n6. Final decision",
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
    postedDate: "2 weeks ago",
    applicationDeadline: "5 May 2025",
    aboutCompany:
      "Netflix, Inc. is an American content platform and production company. The company's primary business is a subscription-based streaming service offering online streaming from a library of films and television series.",
    jobDescription:
      "We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. You will be responsible for deploying, automating, maintaining, and managing our cloud-based production systems.",
    responsibilities: [
      "Design, implement, and maintain CI/CD pipelines",
      "Automate and optimize deployment processes",
      "Monitor system performance and troubleshoot issues",
      "Implement security measures and data protection solutions",
      "Collaborate with development teams to improve infrastructure",
      "Manage cloud resources and optimize costs",
    ],
    requirements: [
      "4-6 years of experience in DevOps or similar role",
      "Strong knowledge of AWS or other cloud platforms",
      "Experience with containerization tools like Docker and Kubernetes",
      "Familiarity with infrastructure as code tools (Terraform, CloudFormation)",
      "Understanding of CI/CD principles and tools (Jenkins, GitLab CI)",
      "Knowledge of monitoring and logging tools",
      "Strong scripting skills (Bash, Python)",
    ],
    benefits: [
      "Competitive salary",
      "Flexible work schedule",
      "Health insurance",
      "Professional development opportunities",
      "Modern work environment",
      "Team events and activities",
    ],
    teamSize: "10-12 members",
    interviewProcess:
      "1. Initial screening\n2. Technical assessment\n3. Technical interview\n4. System design interview\n5. Team interview\n6. Final decision",
  },
  {
    id: 6,
    companyLogo: "/apple.png",
    jobTitle: "iOS Developer",
    companyName: "Apple",
    experience: "5-7 Years",
    salary: "₹70,000 - ₹90,000",
    jobType: "Full-time",
    location: "Hyderabad",
    tags: ["iOS", "Swift", "Objective-C", "Remote"],
    postedDate: "5 days ago",
    applicationDeadline: "25 May 2025",
    aboutCompany:
      "Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services. It is one of the world's largest technology companies by revenue.",
    jobDescription:
      "We are looking for an iOS Developer to join our mobile development team. You will be responsible for developing and maintaining iOS applications, ensuring high-quality and performant user experiences on Apple devices.",
    responsibilities: [
      "Design and build applications for the iOS platform",
      "Ensure the performance, quality, and responsiveness of applications",
      "Collaborate with cross-functional teams to define, design, and ship new features",
      "Identify and correct bottlenecks and fix bugs",
      "Help maintain code quality, organization, and automatization",
      "Stay up-to-date with the latest iOS development practices",
    ],
    requirements: [
      "5-7 years of experience in iOS development",
      "Proficiency in Swift and Objective-C",
      "Experience with iOS frameworks such as Core Data, Core Animation",
      "Knowledge of Apple's design principles and interface guidelines",
      "Experience with RESTful APIs to connect iOS applications to back-end services",
      "Understanding of code versioning tools such as Git",
      "Familiarity with continuous integration",
    ],
    benefits: [
      "Competitive salary package",
      "Health and dental insurance",
      "Retirement plans",
      "Stock options",
      "Paid time off",
      "Professional development opportunities",
      "Employee discount on Apple products",
    ],
    teamSize: "8-10 members",
    interviewProcess:
      "1. Initial phone screening\n2. Technical assessment\n3. Technical interview\n4. System design interview\n5. Behavioral interview\n6. Final decision",
  },
]

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the job details from an API
    // For now, we'll find the job in our sample data based on the slug
    const slug = params.slug

    // Extract job title and company name from the slug
    const slugParts = slug.split("-")
    const companyNameFromSlug = slugParts[slugParts.length - 1]

    // Find the job that matches the slug
    const foundJob = jobsData.find((job) => {
      const jobSlug = `${job.jobTitle.toLowerCase().replace(/ /g, "-")}-${job.companyName.toLowerCase().replace(/ /g, "-")}`
      return slug === jobSlug
    })

    if (foundJob) {
      setJob(foundJob)
    }

    setLoading(false)
  }, [params.slug])

  const handleProceedToInterview = () => {
    if (job) {
      router.push(`/interview/${job.id}`)
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
          <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
            <Image
              src={job.companyLogo || "/placeholder.svg"}
              alt={`${job.companyName} logo`}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{job.jobTitle}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Building className="h-3 w-3" /> {job.companyName}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {job.location}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {job.jobType}
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
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Posted: {job.postedDate}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Apply by: {job.applicationDeadline}
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
              <h2 className="text-xl font-semibold mb-4">About {job.companyName}</h2>
              <p className="text-muted-foreground">{job.aboutCompany}</p>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-muted-foreground mb-6">{job.jobDescription}</p>

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
                {job.interviewProcess.split("\n").map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="text-muted-foreground">{step.substring(step.indexOf(".") + 1).trim()}</div>
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
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium">{job.jobType}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-medium">{job.teamSize}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Application Deadline</p>
                    <p className="font-medium">{job.applicationDeadline}</p>
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

