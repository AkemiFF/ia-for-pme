import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// Create Supabase client for server-side operations
function createSupabaseServerClient() {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return undefined
      },
      set(name: string, value: string, options: any) {
        // Server-side cookie setting handled by Supabase
      },
      remove(name: string, options: any) {
        // Server-side cookie removal handled by Supabase
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

    const supabase = createSupabaseServerClient()

    // Regular Supabase authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    // console.log("Login result:", { data, error });

    if (error) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.user_metadata?.role || "user",
      },
    })
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
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("Get user result:", { user, error });

    if (error || !user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || "user",
      },
    });
  } catch (err: any) {
    console.error("GET /api/auth/custom-login error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
/* -----------------------
   DELETE /api/auth/custom-login
   -> logout using Supabase Auth
   ----------------------- */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const { error } = await supabase.auth.signOut()

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
