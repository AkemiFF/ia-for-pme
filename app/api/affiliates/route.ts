import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 50)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    let query = supabase.from("affiliate_resources").select("*").order("featured", { ascending: false }).order("name")

    if (category) {
      query = query.eq("category", category)
    }

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    const { data: affiliates, error } = await query.limit(limit)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch affiliate resources" }, { status: 500 })
    }

    return NextResponse.json({
      affiliates: affiliates || [],
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
