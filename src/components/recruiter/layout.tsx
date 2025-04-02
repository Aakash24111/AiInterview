"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, LayoutDashboard, Users, FileText, Settings, LogOut, Menu, Bell, Search, User } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface RecruiterLayoutProps {
  children: React.ReactNode
}

export default function RecruiterLayout({ children }: RecruiterLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      

      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">{children}</main>
    </div>
  )
}

