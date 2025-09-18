"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { setAuth, getRoleFromToken } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
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
      const res = await fetch("http://127.0.0.1:8000/user/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: Number(form.phone),
        }),
      })
      if (!res.ok) throw new Error("Registration failed")
      const text = await res.text()
      let token = ""
      let role: string | null = null
      try {
        const data = JSON.parse(text)
        token = String(data?.token || data?.access_token || "")
        role = data?.role ? String(data.role) : null
      } catch {
        token = text.trim()
      }
      if (!token) {
        router.replace("/login")
        return
      }
      if (!role) role = getRoleFromToken(token)
      setAuth(token, role || "USER")
      if (String(role || "USER").toUpperCase() === "COMPANY") {
        router.replace("/recruiter")
      } else {
        router.replace("/interview")
      }
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
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input name="username" placeholder="Username" value={form.username} onChange={onChange} required />
            <Input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
            <Input name="firstName" placeholder="First name" value={form.firstName} onChange={onChange} required />
            <Input name="lastName" placeholder="Last name" value={form.lastName} onChange={onChange} required />
            <Input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
            <Input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : "Register"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


