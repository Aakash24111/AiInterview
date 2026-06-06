"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Lock, LogIn, Building2, UserCheck } from "lucide-react"
import { setAuth, getRoleFromToken } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = (searchParams.get("role") || "").toLowerCase()
  const isRecruiterLogin = roleParam === "recruiter" || roleParam === "company"
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError(null) // Clear error when user starts typing
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
        // Not JSON; backend returns "<ROLE> <JWT>" format
        const trimmed = text.trim().replace(/^"|"$/g, "")
        const parts = trimmed.split(/\s+/)
        const looksLikeJwt = (s: string) => s.split('.').length === 3
        
        if (parts.length >= 2) {
          // Handle "ROLE JWT" format (most common)
          if (!looksLikeJwt(parts[0]) && looksLikeJwt(parts[1])) {
            role = parts[0]
            token = parts[1]
          } 
          // Handle "JWT ROLE" format (fallback)
          else if (looksLikeJwt(parts[0]) && !looksLikeJwt(parts[1])) {
            token = parts[0]
            role = parts[1]
          } 
          // Fallback: assume first is role, second is token
          else {
            role = parts[0]
            token = parts[1]
          }
        } else {
          token = trimmed
        }
      }
      if (!token) throw new Error("Missing token in response")
      
      // Handle the format "ROLE JWT_TOKEN" - extract role but keep full token
      if (token.includes(' ') && !role) {
        const parts = token.split(' ')
        if (parts.length === 2) {
          role = parts[0] // First part is role
          // Keep the full token as is: "ROLE JWT_TOKEN"
        }
      }
      
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
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {isRecruiterLogin ? (
              <Building2 className="h-6 w-6 text-primary" />
            ) : (
              <LogIn className="h-6 w-6 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isRecruiterLogin ? "Recruiter Access" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {isRecruiterLogin 
              ? "Access your recruiter dashboard" 
              : "Sign in to your account to continue"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRecruiterLogin ? (
            <div className="space-y-4">
              <div className="text-center">
                <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-6">
                  You're already authenticated. Proceed to your recruiter dashboard to manage jobs and candidates.
                </p>
              </div>
              <Button 
                className="w-full" 
                onClick={() => router.replace("/recruiter")}
                size="lg"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Go to Recruiter Dashboard
              </Button>
              <div className="text-center">
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => router.push("/login")}
                >
                  Sign in as different user
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={onChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={onChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => router.push("/register")}
                  >
                    Create one here
                  </Button>
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


