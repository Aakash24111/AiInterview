"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, LayoutDashboard, Users, FileText, Settings, LogOut, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface RecruiterLayoutProps {
  children: React.ReactNode
}

export default function RecruiterLayout({ children }: RecruiterLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/recruiter/dashboard/jobs", icon: Briefcase },
    { name: "Candidates", href: "/recruiter/dashboard/all-candidates", icon: Users },
    { name: "Reports", href: "/recruiter/dashboard/reports", icon: FileText },
    { name: "Settings", href: "/recruiter/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sidebar for navigation */}
      <div className="flex h-screen">
        {/* Mobile menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="absolute top-4 left-4 md:hidden z-50">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">AI Interview Jobs</h1>
                </div>
              </div>
              <div className="flex-1 py-4">
                <nav className="space-y-1 px-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          pathname === item.href ? "text-primary" : "text-muted-foreground",
                          "mr-3 h-5 w-5 flex-shrink-0",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    Switch to Candidate
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 border-r bg-background">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 gap-2 mb-5">
                <Briefcase className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">AI Interview Jobs</h1>
              </div>
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href ? "text-primary" : "text-muted-foreground",
                        "mr-3 h-5 w-5 flex-shrink-0",
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>RC</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3 w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between">
                        <div className="text-sm font-medium text-left">Recruiter</div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/">
                          <LogOut className="mr-2 h-4 w-4" />
                          Switch to Candidate
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <main className="flex-1 py-8 px-4 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

