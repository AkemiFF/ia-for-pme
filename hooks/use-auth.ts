"use client"

import { useState, useEffect, useCallback } from "react"

export type User = {
  id: string
  email: string
  name?: string
  role?: string
}

export type LoginResult = {
  ok: boolean
  user?: User
  error?: string
}

const API_AUTH = "/api/auth/custom-login"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API_AUTH, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
          setError(null)
          return { authenticated: true, user: data.user }
        }
      }

      setUser(null)
      return { authenticated: false }
    } catch (err) {
      setUser(null)
      setError("Authentication check failed")
      return { authenticated: false }
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_AUTH, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        return { ok: false, error: data.error || "Login failed" }
      }

      setUser(data.user)
      setError(null)
      return { ok: true, user: data.user }
    } catch (err: any) {
      const errorMsg = err?.message || "Login failed"
      setError(errorMsg)
      return { ok: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    try {
      setLoading(true)

      const response = await fetch(API_AUTH, {
        method: "DELETE",
        credentials: "include",
      })

      // Clear user state regardless of server response
      setUser(null)
      setError(null)

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        return { ok: false, error: data.error || "Logout failed" }
      }

      return { ok: true }
    } catch (err: any) {
      // Still clear user state on error
      setUser(null)
      setError(null)
      return { ok: false, error: err?.message || "Logout failed" }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })
  }, [])

  const verifyToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(API_AUTH, {
        method: "GET",
        credentials: "include",
      })
      return response.ok
    } catch {
      return false
    }
  }, [])

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
    fetchWithAuth,
    verifyToken,
  }
}

export async function verifyAuthToken(request: Request): Promise<{ valid: boolean; user?: User }> {
  try {
    const cookieHeader = request.headers.get("cookie")
    const authHeader = request.headers.get("authorization")

    if (!cookieHeader && !authHeader) {
      return { valid: false }
    }

    // Forward the request to our auth endpoint for verification
    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/custom-login`,
      {
        method: "GET",
        headers: {
          cookie: cookieHeader || "",
          authorization: authHeader || "",
        },
      },
    )

    if (verifyResponse.ok) {
      const data = await verifyResponse.json()
      return { valid: true, user: data.user }
    }

    return { valid: false }
  } catch {
    return { valid: false }
  }
}
