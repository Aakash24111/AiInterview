"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { setAuth, getRoleFromToken } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("http://127.0.0.1:8000/user/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      })
      if (!res.ok) throw new Error("Invalid credentials")
      const text = await res.text()
      let token = ""
      let role: string | null = null
      try {
        const data = JSON.parse(text)
        token = String(data?.token || data?.access_token || "")
        role = data?.role ? String(data.role) : null
      } catch {
        // Not JSON; backend may return either "<JWT> <ROLE>" or "<ROLE> <JWT>"
        const trimmed = text.trim().replace(/^"|"$/g, "")
        const parts = trimmed.split(/\s+/)
        const looksLikeJwt = (s: string) => s.split('.').length === 3
        if (parts.length >= 2) {
          if (looksLikeJwt(parts[0]) && !looksLikeJwt(parts[1])) {
            token = parts[0]
            role = parts[1]
          } else if (!looksLikeJwt(parts[0]) && looksLikeJwt(parts[1])) {
            role = parts[0]
            token = parts[1]
          } else {
            // Fallback: prefer first as token
            token = parts[0]
            role = parts[1]
          }
        } else {
          token = trimmed
        }
      }
      if (!token) throw new Error("Missing token in response")
      if (!role) role = getRoleFromToken(token)
      setAuth(token, role || "USER")
      if (String(role || "USER").toUpperCase() === "COMPANY") {
          router.replace("/recruiter")
      } else {
        router.replace("/interview")
      }
      return
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input name="username" placeholder="Username" value={form.username} onChange={onChange} required />
            <Input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in..." : "Sign in"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


