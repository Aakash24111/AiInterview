"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  X,
  Plus,
  Trash2,
  ArrowLeft,
  Eye,
  Clock,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import RecruiterLayout from "@/components/recruiter/layout"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CreateJob() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "Your Company", // Pre-filled from recruiter profile
    department: "",
    location: "",
    jobType: "",
    experience: "",
    salary: "",
    applicationDeadline: "",
    tags: [] as string[],
    jobDescription: "",
    responsibilities: [""] as string[],
    requirements: [""] as string[],
    benefits: [""] as string[],
    teamSize: "",
    interviewProcess: "",
    aboutCompany: "Your company description here.", // Pre-filled from recruiter profile
    isRemote: false,
    isUrgent: false,
    isPublished: true,
  })

  const [newTag, setNewTag] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const handleAddListItem = (field: "responsibilities" | "requirements" | "benefits") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }))
  }

  const handleRemoveListItem = (field: "responsibilities" | "requirements" | "benefits", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleListItemChange = (
    field: "responsibilities" | "requirements" | "benefits",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the job to the database here
    setShowSuccessDialog(true)
  }

  return (
    <RecruiterLayout>
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create New Job</h1>
              <p className="text-muted-foreground">Create a new job listing to find the perfect candidate</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/recruiter/dashboard")}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save & Publish
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details about the job position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="e.g. Frontend Developer, UX Designer"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. Mumbai, Bangalore"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={formData.jobType} onValueChange={(value) => handleSelectChange("jobType", value)}>
                    <SelectTrigger id="jobType">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Required</Label>
                  <Input
                    id="experience"
                    name="experience"
                    placeholder="e.g. 2-3 Years"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="e.g. ₹20,000 - ₹30,000"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input
                    id="applicationDeadline"
                    name="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    name="teamSize"
                    placeholder="e.g. 5-10 members"
                    value={formData.teamSize}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag (e.g. Remote, JavaScript)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRemote"
                    checked={formData.isRemote}
                    onCheckedChange={(checked) => handleSwitchChange("isRemote", checked)}
                  />
                  <Label htmlFor="isRemote">Remote Work Available</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onCheckedChange={(checked) => handleSwitchChange("isUrgent", checked)}
                  />
                  <Label htmlFor="isUrgent">Urgent Hiring</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
                  />
                  <Label htmlFor="isPublished">Publish Immediately</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Provide detailed information about the job</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Describe the job role, objectives, and expectations"
                  className="min-h-[100px]"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Responsibilities</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddListItem("responsibilities")}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Responsibility ${index + 1}`}
                        value={responsibility}
                        onChange={(e) => handleListItemChange("responsibilities", index, e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveListItem("responsibilities", index)}
                        disabled={formData.responsibilities.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Requirements</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddListItem("requirements")}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Requirement ${index + 1}`}
                        value={requirement}
                        onChange={(e) => handleListItemChange("requirements", index, e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveListItem("requirements", index)}
                        disabled={formData.requirements.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Benefits</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleAddListItem("benefits")}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Benefit ${index + 1}`}
                        value={benefit}
                        onChange={(e) => handleListItemChange("benefits", index, e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveListItem("benefits", index)}
                        disabled={formData.benefits.length <= 1}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewProcess">Interview Process</Label>
                <Textarea
                  id="interviewProcess"
                  name="interviewProcess"
                  placeholder="Describe the interview process steps"
                  className="min-h-[100px]"
                  value={formData.interviewProcess}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutCompany">About Company</Label>
                <Textarea
                  id="aboutCompany"
                  name="aboutCompany"
                  placeholder="Tell candidates about your company"
                  className="min-h-[100px]"
                  value={formData.aboutCompany}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Job Preview</CardTitle>
              <CardDescription>Preview how your job will appear to candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-400">Logo</span>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{formData.jobTitle || "Job Title"}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Building className="h-3 w-3" /> {formData.companyName}
                      </Badge>
                      {formData.location && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {formData.location}
                        </Badge>
                      )}
                      {formData.jobType && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formData.jobType}
                        </Badge>
                      )}
                      {formData.salary && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /> {formData.salary}
                        </Badge>
                      )}
                      {formData.experience && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {formData.experience}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                      {formData.applicationDeadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Apply by:{" "}
                          {formData.applicationDeadline
                            ? new Date(formData.applicationDeadline).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              })
                            : ""}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-lg font-semibold mb-2">Job Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {formData.jobDescription || "No description provided yet."}
                  </p>
                </div>

                {formData.responsibilities.some((r) => r.trim()) && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Responsibilities</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      {formData.responsibilities
                        .filter((r) => r.trim())
                        .map((responsibility, index) => (
                          <li key={index} className="text-muted-foreground">
                            {responsibility}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {formData.requirements.some((r) => r.trim()) && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Requirements</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      {formData.requirements
                        .filter((r) => r.trim())
                        .map((requirement, index) => (
                          <li key={index} className="text-muted-foreground">
                            {requirement}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {formData.benefits.some((b) => b.trim()) && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Benefits</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      {formData.benefits
                        .filter((b) => b.trim())
                        .map((benefit, index) => (
                          <li key={index} className="text-muted-foreground">
                            {benefit}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/recruiter/dashboard")}>
                Cancel
              </Button>
              <Button type="submit">Save & Publish</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Job Created Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your job listing for "{formData.jobTitle}" has been created and published successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/recruiter/dashboard")}>Go to Dashboard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RecruiterLayout>
  )
}

