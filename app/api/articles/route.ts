import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "12"), 50) // Max 50 items
    const category = searchParams.get("category")
    const sector = searchParams.get("sector")
    const budget = searchParams.get("budget")
    const level = searchParams.get("level")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const tags = searchParams.get("tags")?.split(",").filter(Boolean)

    if (page < 1 || limit < 1) {
      return NextResponse.json({ error: "Invalid pagination parameters" }, { status: 400 })
    }

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("articles")
      .select(`
        id,
        title,
        slug,
        excerpt,
        author_name,
        author_avatar,
        published_at,
        reading_time,
        tags,
        featured_image,
        featured,
        sector,
        budget,
        level,
        view_count,
        categories!inner(
          id,
          name,
          slug
        )
      `)
      .eq("published", true)
      .order("published_at", { ascending: false })

    // Apply filters
    if (category) {
      query = query.eq("categories.slug", category)
    }

    if (sector) {
      query = query.eq("sector", sector)
    }

    if (budget) {
      query = query.eq("budget", budget)
    }

    if (level) {
      query = query.eq("level", level)
    }

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    if (search) {
      const sanitizedSearch = search.replace(/[%_]/g, "\\$&")
      query = query.or(`title.ilike.%${sanitizedSearch}%,excerpt.ilike.%${sanitizedSearch}%`)
    }

    if (tags && tags.length > 0) {
      query = query.overlaps("tags", tags)
    }

    // Get total count for pagination
    const { count } = await supabase.from("articles").select("*", { count: "exact", head: true }).eq("published", true)

    // Execute query with pagination
    const { data: articles, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }

    try {
      await supabase.from("analytics_events").insert({
        event_type: "api_articles_list",
        event_data: {
          page,
          limit,
          filters: { category, sector, budget, level, featured, search, tags },
        },
        user_agent: request.headers.get("user-agent"),
        referrer: request.headers.get("referer"),
      })
    } catch (analyticsError) {
      // Log analytics error but don't fail the request
      console.warn("Analytics tracking failed:", analyticsError)
    }

    return NextResponse.json({
      articles: articles || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
