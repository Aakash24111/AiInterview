"use client"

export type UserRole = "USER" | "COMPANY" | string

const TOKEN_KEY = "userToken"
const ROLE_KEY = "userRole"

export function setAuth(token: string, role: UserRole) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(ROLE_KEY, role)
  } catch {}
}

export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
  } catch {}
}

export function getToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const role = localStorage.getItem(ROLE_KEY)
    
    if (!token) return null
    
    // If token already has role prefix, return as is
    if (token.includes(' ')) {
      return token
    }
    
    // If we have a role, prefix the token with it
    if (role) {
      return `${role} ${token}`
    }
    
    return token
  } catch {
    return null
  }
}

export function getRole(): UserRole | null {
  try {
    return (localStorage.getItem(ROLE_KEY) as UserRole | null) ?? null
  } catch {
    return null
  }
}

export function getRoleFromToken(token: string): UserRole | null {
  try {
    // Handle "ROLE JWT_TOKEN" format
    if (token.includes(' ')) {
      const parts = token.split(' ')
      if (parts.length >= 2) {
        return parts[0] // Return the role part
      }
    }
    
    // Handle pure JWT format
    const parts = token.split(".")
    if (parts.length < 2) return null
    const json = JSON.parse(typeof atob !== "undefined" ? atob(parts[1]) : Buffer.from(parts[1], 'base64').toString('utf8'))
    const role = json?.role || json?.roles?.[0] || json?.authorities?.[0]
    return role ?? null
  } catch {
    return null
  }
}

export function decodeToken(token: string): any | null {
  try {
    // Handle "ROLE JWT_TOKEN" format
    if (token.includes(' ')) {
      const parts = token.split(' ')
      if (parts.length >= 2) {
        token = parts[1] // Use the JWT part
      }
    }
    
    // Handle pure JWT format
    const parts = token.split(".")
    if (parts.length < 2) return null
    const json = JSON.parse(typeof atob !== "undefined" ? atob(parts[1]) : Buffer.from(parts[1], 'base64').toString('utf8'))
    return json
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeToken(token)
    if (!payload || !payload.exp) return true
    
    // Convert exp (seconds) to milliseconds and compare with current time
    const expirationTime = payload.exp * 1000
    const currentTime = Date.now()
    
    return currentTime >= expirationTime
  } catch {
    return true
  }
}

export function getTokenExpirationTime(token: string): number | null {
  try {
    const payload = decodeToken(token)
    if (!payload || !payload.exp) return null
    
    return payload.exp * 1000 // Convert to milliseconds
  } catch {
    return null
  }
}

export function logoutOnExpiry(): void {
  const token = getToken()
  if (!token || isTokenExpired(token)) {
    clearAuth()
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
}


