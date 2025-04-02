"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Building, User, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function RecruiterOnboarding() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("account")
  const [progress, setProgress] = useState(33)

  const [formData, setFormData] = useState({
    // Account details
    email: "",
    password: "",
    confirmPassword: "",

    // Personal details
    firstName: "",
    lastName: "",
    jobTitle: "",
    phone: "",

    // Company details
    companyName: "",
    industry: "",
    companySize: "",
    companyDescription: "",
    companyWebsite: "",
    companyLocation: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    if (value === "account") setProgress(33)
    else if (value === "personal") setProgress(66)
    else if (value === "company") setProgress(100)
  }

  // Add this effect inside the component to handle Clerk integration
  useEffect(() => {
    // In a real app with Clerk, you would check if the user has already completed onboarding
    // If they have, redirect them to the dashboard
    const checkOnboardingStatus = async () => {
      try {
        // This is where you would check if the user has completed onboarding
        // For example:
        // const user = await clerk.user.getUser()
        // if (user.metadata.hasCompletedOnboarding) {
        //   router.push("/recruiter/dashboard")
        // }
      } catch (error) {
        console.error("Error checking onboarding status:", error)
      }
    }

    checkOnboardingStatus()
  }, [])

  // Update the handleSubmit function to save data with Clerk
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // In a real app with Clerk, you would save the onboarding data to the user's metadata
      // For example:
      // await clerk.user.update({
      //   metadata: {
      //     hasCompletedOnboarding: true,
      //     companyName: formData.companyName,
      //     companySize: formData.companySize,
      //     industry: formData.industry,
      //     // etc.
      //   }
      // })

      // For now, just redirect to the dashboard
      router.push("/recruiter/dashboard")
    } catch (error) {
      console.error("Error saving onboarding data:", error)
    }
  }

  const handleNext = () => {
    if (activeTab === "account") setActiveTab("personal")
    else if (activeTab === "personal") setActiveTab("company")
  }

  const handlePrevious = () => {
    if (activeTab === "company") setActiveTab("personal")
    else if (activeTab === "personal") setActiveTab("account")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">AI Interview Jobs</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Recruiter Onboarding</h1>
            <p className="text-muted-foreground">
              Set up your recruiter account to start creating job listings and interviewing candidates
            </p>
          </div>

          <div className="mb-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Account</span>
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Personal</span>
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Company</span>
                </TabsTrigger>
              </TabsList>

              {/* Account Details */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Create your account credentials to access the recruiter dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="button" onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Personal Details */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>Tell us about yourself as a recruiter</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        placeholder="e.g. HR Manager, Technical Recruiter"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      Previous
                    </Button>
                    <Button type="button" onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Company Details */}
              <TabsContent value="company">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                    <CardDescription>
                      Tell us about your company to help candidates learn more about you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => handleSelectChange("industry", value)}
                        >
                          <SelectTrigger id="industry">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Select
                          value={formData.companySize}
                          onValueChange={(value) => handleSelectChange("companySize", value)}
                        >
                          <SelectTrigger id="companySize">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                            <SelectItem value="1000+">1000+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyDescription">Company Description</Label>
                      <Textarea
                        id="companyDescription"
                        name="companyDescription"
                        placeholder="Tell candidates about your company culture, mission, and values"
                        className="min-h-[100px]"
                        value={formData.companyDescription}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Company Website</Label>
                      <Input
                        id="companyWebsite"
                        name="companyWebsite"
                        type="url"
                        placeholder="https://yourcompany.com"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyLocation">Company Location</Label>
                      <Input
                        id="companyLocation"
                        name="companyLocation"
                        placeholder="City, Country"
                        value={formData.companyLocation}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handlePrevious}>
                      Previous
                    </Button>
                    <Button type="submit">Complete Setup</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </main>
    </div>
  )
}

