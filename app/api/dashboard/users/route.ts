import { type NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth/verify-token"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  console.log("[v0] GET /api/dashboard/users - Starting authentication check")

  const authResult = await verifyAuthToken(request)
  if (!authResult.success) {
    console.log("[v0] GET /api/dashboard/users - Authentication failed")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await sql`
      SELECT 
        id,
        email,
        role,
        created_at,
        last_login,
        is_active
      FROM users 
      ORDER BY created_at DESC
    `

    const stats = await sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d
      FROM users
    `

    return NextResponse.json({
      users,
      stats: stats[0],
    })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authResult = await verifyAuthToken(request)
  if (!authResult.success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { email, role = "user", password } = await request.json()

    const result = await sql`
      INSERT INTO users (email, role, password_hash, is_active, created_at)
      VALUES (${email}, ${role}, ${password}, true, NOW())
      RETURNING id, email, role, created_at
    `

    return NextResponse.json({ user: result[0] })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}
