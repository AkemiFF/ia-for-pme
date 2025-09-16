import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export interface AuthUser {
  id: string
  email: string
  role: string
}

export async function verifyAuthToken(request: Request): Promise<AuthUser | null> {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization")
    let token: string | null = null

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    } else {
      // Fallback to cookie
      const cookieStore = await cookies()
      token = cookieStore.get("admin-token")?.value || null
    }

    if (!token) {
      return null
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error("JWT_SECRET not configured")
      return null
    }

    const decoded = jwt.verify(token, jwtSecret) as any

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "admin",
    }
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
