interface TokenData {
  token: string
  expiresAt: number
  userId: string
  email: string
}

interface SessionData {
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    name?: string
    role?: string
  } | null
  token: string | null
}

class TokenManager {
  private static instance: TokenManager
  private readonly TOKEN_KEY = "authToken"
  private readonly SESSION_COOKIE = "admin-session"

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  // Store token in localStorage with expiration
  setToken(token: string, expiresIn: number = 7 * 24 * 60 * 60 * 1000): void {
    if (typeof window === "undefined") return

    const tokenData: TokenData = {
      token,
      expiresAt: Date.now() + expiresIn,
      userId: this.parseTokenUserId(token),
      email: this.parseTokenEmail(token),
    }

    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData))
  }

  // Get token from localStorage or cookies
  getToken(): string | null {
    if (typeof window === "undefined") return null

    // First try localStorage
    const storedData = localStorage.getItem(this.TOKEN_KEY)
    if (storedData) {
      try {
        const tokenData: TokenData = JSON.parse(storedData)
        if (tokenData.expiresAt > Date.now()) {
          return tokenData.token
        } else {
          this.clearToken()
        }
      } catch (error) {
        console.error("Error parsing token data:", error)
        this.clearToken()
      }
    }

    // Fallback to session cookie
    const sessionToken = this.getSessionCookie()
    return sessionToken
  }

  // Get session cookie
  private getSessionCookie(): string | null {
    if (typeof document === "undefined") return null

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${this.SESSION_COOKIE}=`))
      ?.split("=")[1]

    return cookie || null
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken()
    return !!token
  }

  // Get current session data
  getSession(): SessionData {
    const token = this.getToken()

    if (!token) {
      return {
        isAuthenticated: false,
        user: null,
        token: null,
      }
    }

    // Try to get user data from localStorage
    const storedData = localStorage.getItem(this.TOKEN_KEY)
    let userData = null

    if (storedData) {
      try {
        const tokenData: TokenData = JSON.parse(storedData)
        userData = {
          id: tokenData.userId,
          email: tokenData.email,
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    return {
      isAuthenticated: true,
      user: userData,
      token,
    }
  }

  // Clear all authentication data
  clearToken(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem(this.TOKEN_KEY)

    // Clear session cookie by setting it to expire
    if (typeof document !== "undefined") {
      document.cookie = `${this.SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  }

  // Parse user ID from token (for base64 encoded tokens)
  private parseTokenUserId(token: string): string {
    try {
      // For base64 encoded session tokens (format: userId:timestamp)
      const decoded = atob(token)
      const [userId] = decoded.split(":")
      return userId || ""
    } catch (error) {
      // For JWT tokens or other formats, return empty string
      return ""
    }
  }

  // Parse email from token (placeholder for now)
  private parseTokenEmail(token: string): string {
    // This would need to be implemented based on your token format
    // For now, return empty string
    return ""
  }

  // Create authorization header for API calls
  getAuthHeader(): Record<string, string> {
    const token = this.getToken()
    if (!token) {
      return {}
    }

    return {
      Authorization: `Bearer ${token}`,
    }
  }

  // Refresh token if needed (placeholder for future implementation)
  async refreshToken(): Promise<boolean> {
    // TODO: Implement token refresh logic
    return false
  }

  // Set user data after successful login
  setUserData(user: { id: string; email: string; name?: string; role?: string }, token: string): void {
    this.setToken(token)

    // Update localStorage with user data
    const tokenData: TokenData = {
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      userId: user.id,
      email: user.email,
    }

    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData))
  }
}

export const tokenManager = TokenManager.getInstance()
export type { SessionData, TokenData }
