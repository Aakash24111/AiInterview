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
    return localStorage.getItem(TOKEN_KEY)
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
    const parts = token.split(".")
    if (parts.length < 2) return null
    const json = JSON.parse(typeof atob !== "undefined" ? atob(parts[1]) : Buffer.from(parts[1], 'base64').toString('utf8'))
    const role = json?.role || json?.roles?.[0] || json?.authorities?.[0]
    return role ?? null
  } catch {
    return null
  }
}


