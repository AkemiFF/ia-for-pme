import { verifyAuthToken } from "@/lib/auth/verify-token"
import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  console.log("[v0] GET /api/dashboard/users - Starting authentication check")

  const authResult = await verifyAuthToken(request)
  if (!authResult || !authResult.success) {
    console.log("[v0] GET /api/dashboard/users - Authentication failed")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, name, role, created_at, updated_at")
      .order("created_at", { ascending: false })

    if (usersError) throw usersError

    const { data: stats, error: statsError } = await supabase.from("users").select("id, created_at")

    if (statsError) throw statsError

    const totalUsers = stats?.length || 0
    // const activeUsers = stats?.filter((u) => u.is_active).length || 0
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const newUsers30d = stats?.filter((u) => new Date(u.created_at) >= thirtyDaysAgo).length || 0

    return NextResponse.json({
      users,
      stats: {
        total_users: totalUsers,
        // active_users: activeUsers,
        new_users_30d: newUsers30d,
      },
    })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAuthToken(request)
  if (!authResult || !authResult.success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { email, role = "user", password } = await request.json()

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email,
        role,
        password_hash: password, // In production, hash this properly
        is_active: true,
        created_at: new Date().toISOString(),
      })
      .select("id, email, role, created_at")
      .single()

    if (error) throw error

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
