"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getToken, isTokenExpired, logoutOnExpiry } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: string[]
}

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/',
  '/about',
  '/contact'
]

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  allowedRoles = [] 
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken()
      
      // Check if current route is public
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
      
      if (!token) {
        // No token found
        if (requireAuth && !isPublicRoute) {
          console.log("No token found, redirecting to login...")
          router.push('/login')
          return
        }
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log("Token expired, logging out...")
        logoutOnExpiry()
        return
      }

      // Token is valid
      setIsAuthenticated(true)
      
      // If user is on login page but has valid token, redirect to dashboard
      if (pathname === '/login' && token) {
        console.log("User already authenticated, redirecting to dashboard...")
        router.push('/recruiter/dashboard')
        return
      }

      // Check role-based access if required
      if (allowedRoles.length > 0) {
        const tokenData = JSON.parse(
          typeof atob !== "undefined" 
            ? atob(token.split('.')[1]) 
            : Buffer.from(token.split('.')[1], 'base64').toString('utf8')
        )
        const userRole = tokenData?.role
        
        if (!allowedRoles.includes(userRole)) {
          console.log(`Access denied. Required roles: ${allowedRoles.join(', ')}, User role: ${userRole}`)
          router.push('/unauthorized')
          return
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router, requireAuth, allowedRoles])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Render children if authentication check passes
  return <>{children}</>
}
