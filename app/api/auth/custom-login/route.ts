import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

function createSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({
          name,
          value,
          ...options,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

/* -----------------------
   POST /api/auth/custom-login
   -> login using Supabase Auth
   ----------------------- */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, password } = body ?? {}

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("[v0] Login attempt:", { email, success: !error })

    if (error) {
      console.log("[v0] Login error:", error.message)
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    console.log("[v0] Login successful for user:", data.user?.email)

    const response = NextResponse.json({
      ok: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.user_metadata?.role || "user",
      },
    })

    return response
  } catch (err: any) {
    console.error("POST /api/auth/custom-login error:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

/* -----------------------
   GET /api/auth/custom-login
   -> verify session using Supabase Auth
   ----------------------- */
export async function GET() {
  try {
    const supabase = createSupabaseClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    console.log("[v0] Session check:", { hasUser: !!user, error: error?.message })

    if (error || !user) {
      return NextResponse.json(
        {
          ok: true,
          user: null,
          message: "Aucune session active",
        },
        { status: 200 },
      )
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || "user",
      },
    })
  } catch (err: any) {
    console.error("GET /api/auth/custom-login error:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

/* -----------------------
   DELETE /api/auth/custom-login
   -> logout using Supabase Auth
   ----------------------- */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createSupabaseClient()

    const { error } = await supabase.auth.signOut()

    console.log("[v0] Logout attempt:", { success: !error })

    if (error) {
      console.error("Logout error:", error)
      return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("DELETE /api/auth/custom-login error:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
