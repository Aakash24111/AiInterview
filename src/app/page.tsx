"use client"

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Moon, Sun, CheckCircle, FileText, Video, MessageSquare, Play, ArrowRight } from "lucide-react"
import AIGeneratedImage from "@/components/ai-generated-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check if user prefers dark mode
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      localStorage.theme = "light"
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.theme = "dark"
      setIsDarkMode(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-6">
                <Badge
                  variant="outline"
                  className="px-4 py-1 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                >
                  New
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">AI-powered interview preparation</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Ace Your Next</span>
                <span className="block text-blue-600 dark:text-blue-400">Interview with AI</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                Practice interviews tailored to your resume and the job you want. Get real-time feedback and improve
                your chances of landing your dream job.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <SignedOut>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <SignInButton mode="modal">
                      <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
                        Sign In as Candidate <ArrowRight className="h-4 w-4" />
                      </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
                        Sign In as Recruiter <ArrowRight className="h-4 w-4" />
                      </Button>
                    </SignInButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      onClick={() => router.push("/interview")}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Candidate Dashboard <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => router.push("/recruiter")}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      Recruiter Dashboard <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </SignedIn>
                <Button variant="outline" size="lg" asChild className="mt-4 sm:mt-0">
                  <a href="#how-it-works">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <AIGeneratedImage
                  width={600}
                  height={400}
                  theme={isDarkMode ? "dark" : "light"}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Features That Set Us Apart</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform offers everything you need to prepare for your next interview.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <CardTitle>Resume Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI analyzes your resume to create personalized interview questions relevant to your experience and
                  skills.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Video className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <CardTitle>Video Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Practice with realistic video interviews that simulate the real thing, complete with speech-to-text
                  conversion.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <CardTitle>AI Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Get instant feedback on your answers, body language, and presentation to improve your interview
                  skills.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
                </div>
                <CardTitle>Company Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  See which companies are recruiting for positions matching your skills and prepare specifically for
                  them.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <Play className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <CardTitle>Interview Recordings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Review your interview recordings to see your progress and identify areas for improvement.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-700">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <CardTitle>Recruiter Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Companies can review your interview performance with your permission, increasing your chances of
                  getting hired.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">How AI Interview Works</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform makes interview preparation simple and effective.
            </p>
          </div>

          <div className="mt-16">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mx-auto">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Upload Your Resume</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Upload your resume and select the job positions you're interested in. Our AI will analyze your
                  qualifications.
                </p>
              </div>

              {/* Step 2 */}
              <div className="mt-10 lg:mt-0 text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mx-auto">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Start Your Interview</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Begin your video interview session. Our AI will ask questions tailored to your experience and the job
                  requirements.
                </p>
              </div>

              {/* Step 3 */}
              <div className="mt-10 lg:mt-0 text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mx-auto">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Get Feedback & Improve</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Receive detailed feedback on your performance and practice until you're confident for your real
                  interview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that works best for your interview preparation needs.
            </p>
          </div>

          <Tabs defaultValue="monthly" className="mt-12 w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
              <TabsTrigger value="yearly">Yearly Billing (Save 20%)</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly">
              <div className="grid gap-8 lg:grid-cols-3 ">
                {/* Basic Plan */}
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Basic</CardTitle>
                    <div className="mt-4 flex justify-center">
                      <span className="text-5xl font-extrabold">$0</span>
                      <span className="ml-1 text-xl text-gray-500 dark:text-gray-300 self-end">/month</span>
                    </div>
                    <CardDescription className="text-center">
                      Perfect for beginners looking to practice basic interview skills.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">3 AI interviews per month</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Basic feedback</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Resume analysis</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <SignedOut>
                      <div className="w-full space-y-2">
                        <SignInButton mode="modal">
                          <Button className="w-full">Sign In as Candidate</Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                          <Button className="w-full bg-green-600 hover:bg-green-700">Sign In as Recruiter</Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="w-full space-y-2">
                        <Button className="w-full" onClick={() => router.push("/interview")}>
                          Candidate Access
                        </Button>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => router.push("/recruiter")}
                        >
                          Recruiter Access
                        </Button>
                      </div>
                    </SignedIn>
                  </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="border-2 border-blue-500 dark:border-blue-400 shadow-xl bg-white dark:bg-gray-700 relative lg:scale-105 lg:-translate-y-2">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-blue-500 hover:bg-blue-500 text-white px-4 py-1">MOST POPULAR</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Pro</CardTitle>
                    <div className="mt-4 flex justify-center">
                      <span className="text-5xl font-extrabold">$19</span>
                      <span className="ml-1 text-xl text-gray-500 dark:text-gray-300 self-end">/month</span>
                    </div>
                    <CardDescription className="text-center">
                      For job seekers actively preparing for interviews.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Unlimited AI interviews</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Detailed performance analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Company-specific preparation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Interview recordings</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <SignedOut>
                      <div className="w-full space-y-2">
                        <SignInButton mode="modal">
                          <Button className="w-full">Sign In as Candidate</Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                          <Button className="w-full bg-green-600 hover:bg-green-700">Sign In as Recruiter</Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="w-full space-y-2">
                        <Button className="w-full" onClick={() => router.push("/interview?plan=pro")}>
                          Candidate Access
                        </Button>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => router.push("/recruiter")}
                        >
                          Recruiter Access
                        </Button>
                      </div>
                    </SignedIn>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Enterprise</CardTitle>
                    <div className="mt-4 flex justify-center">
                      <span className="text-5xl font-extrabold">$99</span>
                      <span className="ml-1 text-xl text-gray-500 dark:text-gray-300 self-end">/month</span>
                    </div>
                    <CardDescription className="text-center">
                      For companies looking to streamline their recruitment process.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">All Pro features</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Candidate management</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Custom interview questions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Team collaboration tools</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">API access</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <SignedOut>
                      <div className="w-full space-y-2">
                        <SignInButton mode="modal">
                          <Button className="w-full">Sign In as Candidate</Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                          <Button className="w-full bg-green-600 hover:bg-green-700">Sign In as Recruiter</Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="w-full space-y-2">
                        <Button className="w-full" onClick={() => router.push("/interview?plan=enterprise")}>
                          Candidate Access
                        </Button>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => router.push("/recruiter")}
                        >
                          Recruiter Access
                        </Button>
                      </div>
                    </SignedIn>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="yearly">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Basic Plan - Yearly */}
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Basic</CardTitle>
                    <div className="mt-4 flex justify-center">
                      <span className="text-5xl font-extrabold">$0</span>
                      <span className="ml-1 text-xl text-gray-500 dark:text-gray-300 self-end">/year</span>
                    </div>
                    <CardDescription className="text-center">
                      Perfect for beginners looking to practice basic interview skills.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">3 AI interviews per month</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Basic feedback</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Resume analysis</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <SignedOut>
                      <div className="w-full space-y-2">
                        <SignInButton mode="modal">
                          <Button className="w-full">Sign In as Candidate</Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                          <Button className="w-full bg-green-600 hover:bg-green-700">Sign In as Recruiter</Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="w-full space-y-2">
                        <Button className="w-full" onClick={() => router.push("/interview")}>
                          Candidate Access
                        </Button>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => router.push("/recruiter")}
                        >
                          Recruiter Access
                        </Button>
                      </div>
                    </SignedIn>
                  </CardFooter>
                </Card>

                {/* Pro Plan - Yearly */}
                <Card className="border-2 border-blue-500 dark:border-blue-400 shadow-xl bg-white dark:bg-gray-700 relative lg:scale-105 lg:-translate-y-2">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-blue-500 hover:bg-blue-500 text-white px-4 py-1">MOST POPULAR</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Pro</CardTitle>
                    <div className="mt-4 flex justify-center">
                      <span className="text-5xl font-extrabold">$182</span>
                      <span className="ml-1 text-xl text-gray-500 dark:text-gray-300 self-end">/year</span>
                    </div>
                    <CardDescription className="text-center">
                      For job seekers actively preparing for interviews.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Unlimited AI interviews</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Detailed performance analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Company-specific preparation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Interview recordings</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <SignedOut>
                      <div className="w-full space-y-2">
                        <SignInButton mode="modal">
                          <Button className="w-full">Sign In as Candidate</Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                          <Button className="w-full bg-green-600 hover:bg-green-700">Sign In as Recruiter</Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="w-full space-y-2">
                        <Button className="w-full" onClick={() => router.push("/interview?plan=pro")}>
                          Candidate Access
                        </Button>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => router.push("/recruiter")}
                        >
                          Recruiter Access
                        </Button>
                      </div>
                    </SignedIn>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan - Yearly */}
                <Card className="border-0 shadow-lg bg-white dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">Enterprise</CardTitle>
                    <div className="mt-4 flex justify-center">
                      <span className="text-5xl font-extrabold">$950</span>
                      <span className="ml-1 text-xl text-gray-500 dark:text-gray-300 self-end">/year</span>
                    </div>
                    <CardDescription className="text-center">
                      For companies looking to streamline their recruitment process.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">All Pro features</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Candidate management</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Custom interview questions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Team collaboration tools</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5" />
                        <span className="ml-3 text-gray-600 dark:text-gray-300">API access</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <SignedOut>
                      <div className="w-full space-y-2">
                        <SignInButton mode="modal">
                          <Button className="w-full">Sign In as Candidate</Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                          <Button className="w-full bg-green-600 hover:bg-green-700">Sign In as Recruiter</Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="w-full space-y-2">
                        <Button className="w-full" onClick={() => router.push("/interview?plan=enterprise")}>
                          Candidate Access
                        </Button>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => router.push("/recruiter")}
                        >
                          Recruiter Access
                        </Button>
                      </div>
                    </SignedIn>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find answers to common questions about our AI Interview platform.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does the AI interview process work?</AccordionTrigger>
                <AccordionContent>
                  Our AI analyzes your resume and the job description to create personalized interview questions. During
                  the video interview, your responses are recorded and analyzed in real-time, providing immediate
                  feedback on your answers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we take data security seriously. Your resume and interview recordings are encrypted and only
                  shared with companies when you explicitly give permission. You can delete your data at any time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Can I practice for specific companies?</AccordionTrigger>
                <AccordionContent>
                  Our Pro and Enterprise plans allow you to select specific companies and roles to tailor your interview
                  practice. The AI will generate questions based on the company's known interview style and job
                  requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How accurate is the speech-to-text conversion?</AccordionTrigger>
                <AccordionContent>
                  Our speech-to-text technology is highly accurate and continuously improving. It can handle different
                  accents and speaking styles, ensuring your responses are accurately captured for analysis and
                  feedback.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can companies see my practice interviews?</AccordionTrigger>
                <AccordionContent>
                  No, your practice interviews remain private unless you specifically choose to share them. For job
                  applications, you can opt to share selected interviews with potential employers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
                <AccordionContent>
                  You can cancel your subscription at any time from your account settings. Your access will continue
                  until the end of your current billing period.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AI Interview</h3>
              <p className="text-gray-400">
                Revolutionizing the way candidates prepare for job interviews with AI technology.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">Email: support@aiinterview.com</li>
                <li className="text-gray-400">Phone: +1 (555) 123-4567</li>
                <li className="text-gray-400">Address: 123 AI Street, Tech City</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AI Interview. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

