"use client"

import { useEffect } from 'react'
import { getToken, isTokenExpired, logoutOnExpiry } from '@/lib/auth'

export function useTokenExpiry() {
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = getToken()
      if (token && isTokenExpired(token)) {
        console.log("Token has expired, logging out...")
        logoutOnExpiry()
      }
    }

    // Check immediately
    checkTokenExpiry()

    // Check every 30 seconds
    const interval = setInterval(checkTokenExpiry, 30000)

    return () => clearInterval(interval)
  }, [])
}

export function useTokenExpiryOnMount() {
  useEffect(() => {
    const token = getToken()
    if (token && isTokenExpired(token)) {
      console.log("Token has expired on page load, logging out...")
      logoutOnExpiry()
    }
  }, [])
}
