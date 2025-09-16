import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyAuthToken } from "@/lib/auth/verify-token"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] GET /api/newsletter/subscribers - Starting authentication check")
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const user = await verifyAuthToken(request)

    if (!user) {
      console.log("[v0] GET /api/newsletter/subscribers - Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] GET /api/newsletter/subscribers - Authentication successful for user:", user.email)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 50)
    const search = searchParams.get("search")
    const offset = (page - 1) * limit

    let query = supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data: subscribers, error } = await query.range(offset, offset + limit - 1)
    const { count } = await supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
    }

    console.log("[v0] GET /api/newsletter/subscribers - Successfully fetched", subscribers?.length || 0, "subscribers")

    return NextResponse.json({
      subscribers: subscribers || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] GET /api/newsletter/subscribers - API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const user = await verifyAuthToken(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email, name, segments = [], interests = [] } = body

    // Validate required fields
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email valide requis" }, { status: 400 })
    }

    // Check if subscriber already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single()

    if (existingSubscriber) {
      return NextResponse.json({ error: "Cet email est déjà abonné" }, { status: 409 })
    }

    const { data: subscriber, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        name,
        segments,
        interests,
        source: "admin-dashboard",
        subscribed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Erreur lors de l'ajout de l'abonné" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      subscriber,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
