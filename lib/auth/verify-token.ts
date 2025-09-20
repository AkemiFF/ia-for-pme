import { createServerClient } from "@supabase/ssr"

export interface AuthUser {
  success: any
  name: string
  id: string
  email: string
  role: string
}

export async function verifyAuthToken(request: Request): Promise<AuthUser | null> {
  try {
    console.log("[v0] Verifying auth token with Supabase...")

    // Create Supabase client for server-side operations
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          const cookieHeader = request.headers.get("cookie")
          if (!cookieHeader) return undefined

          const cookies = cookieHeader.split(";").reduce(
            (acc, cookie) => {
              const [key, value] = cookie.trim().split("=")
              acc[key] = decodeURIComponent(value || "")
              return acc
            },
            {} as Record<string, string>,
          )

          return cookies[name]
        },
        set(name: string, value: string, options: any) {
          // Server-side cookie setting handled by Supabase
        },
        remove(name: string, options: any) {
          // Server-side cookie removal handled by Supabase
        },
      },
    })

    // Try to get user from Supabase session
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.log("[v0] No valid Supabase session found")
      return null
    }

    console.log("[v0] Supabase user verified successfully:", user.email)

    return {
      success: true,
      name: user.user_metadata?.name || user.email || "",
      id: user.id,
      email: user.email || "",
      role: user.user_metadata?.role || "user",
    }
  } catch (error) {
    console.error("[v0] Supabase auth verification failed:", error)
    return null
  }
}
