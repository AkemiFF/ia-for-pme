import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)

    const excludeId = searchParams.get("exclude")
    const category = searchParams.get("category")
    const tags = searchParams.get("tags")?.split(",") || []
    const limit = Number.parseInt(searchParams.get("limit") || "4")

    let query = supabase
      .from("articles")
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq("published", true)
      .order("published_at", { ascending: false })

    // Exclude current article if provided
    if (excludeId) {
      query = query.neq("id", Number.parseInt(excludeId))
    }

    // Smart recommendations logic
    if (category || tags.length > 0) {
      // First try: same category and similar tags
      if (category && tags.length > 0) {
        const { data: categoryArticles } = await query
          .eq("categories.slug", category)
          .overlaps("tags", tags)
          .limit(limit)

        if (categoryArticles && categoryArticles.length >= limit) {
          return NextResponse.json({ articles: categoryArticles })
        }
      }

      // Second try: same category
      if (category) {
        const { data: categoryArticles } = await query.eq("categories.slug", category).limit(limit)

        if (categoryArticles && categoryArticles.length > 0) {
          return NextResponse.json({ articles: categoryArticles })
        }
      }

      // Third try: similar tags
      if (tags.length > 0) {
        const { data: tagArticles } = await query.overlaps("tags", tags).limit(limit)

        if (tagArticles && tagArticles.length > 0) {
          return NextResponse.json({ articles: tagArticles })
        }
      }
    }

    // Fallback: most popular/featured articles
    const { data: fallbackArticles, error } = await query.eq("featured", true).limit(limit)

    if (error) {
      console.error("Error fetching recommendations:", error)
      return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
    }

    return NextResponse.json({ articles: fallbackArticles || [] })
  } catch (error) {
    console.error("Error in recommendations API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
