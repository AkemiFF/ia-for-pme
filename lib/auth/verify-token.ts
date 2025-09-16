import jwt from "jsonwebtoken"

export interface AuthUser {
  id: string
  email: string
  role: string
}

export async function verifyAuthToken(request: Request): Promise<AuthUser | null> {
  try {
    console.log("[v0] Verifying auth token...")

    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization")
    let token: string | null = null

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7)
      console.log("[v0] Found Bearer token in Authorization header")
    } else {
      const cookieHeader = request.headers.get("cookie")
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split("=")
            acc[key] = value
            return acc
          },
          {} as Record<string, string>,
        )

        token = cookies["admin-token"] || null
        console.log("[v0] Found token in cookies:", !!token)
      }
    }

    if (!token) {
      console.log("[v0] No token found in headers or cookies")
      return null
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error("[v0] JWT_SECRET not configured")
      return null
    }

    const decoded = jwt.verify(token, jwtSecret) as any
    console.log("[v0] Token verified successfully for user:", decoded.email)

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "admin",
    }
  } catch (error) {
    console.error("[v0] Token verification failed:", error)
    return null
  }
}
