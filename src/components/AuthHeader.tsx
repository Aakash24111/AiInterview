"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { clearAuth, getRole, getToken } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AuthHeader() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setToken(getToken())
    setRole(getRole())
  }, [])

  const logout = () => {
    clearAuth()
    setToken(null)
    setRole(null)
    router.replace("/")
  }

  if (!token) {
    return (
      <div className="flex gap-2">
        <Button asChild variant="outline"><Link href="/login">Login</Link></Button>
        <Button asChild><Link href="/register">Register</Link></Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {String(role).toUpperCase() === "COMPANY" ? (
        <Button asChild variant="outline"><Link href="/recruiter">Recruiter Dashboard</Link></Button>
      ) : (
        <Button asChild variant="outline"><Link href="/interview">Candidate Dashboard</Link></Button>
      )}
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}




