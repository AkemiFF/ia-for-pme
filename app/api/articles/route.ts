import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fallbackArticles } from "@/lib/data/fallback-articles"

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

    if (error || !articles || articles.length === 0) {
      console.log("[v0] Using fallback articles data")

      let filteredArticles = [...fallbackArticles]

      // Apply filters to fallback data
      if (category) {
        filteredArticles = filteredArticles.filter((article) => article.category.slug === category)
      }
      if (sector && sector !== "Tous secteurs") {
        filteredArticles = filteredArticles.filter((article) => article.sector === sector)
      }
      if (budget) {
        filteredArticles = filteredArticles.filter((article) => article.budget === budget)
      }
      if (level) {
        filteredArticles = filteredArticles.filter((article) => article.level === level)
      }
      if (featured === "true") {
        filteredArticles = filteredArticles.filter((article) => article.featured)
      }
      if (search) {
        const searchLower = search.toLowerCase()
        filteredArticles = filteredArticles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchLower) || article.excerpt.toLowerCase().includes(searchLower),
        )
      }
      if (tags && tags.length > 0) {
        filteredArticles = filteredArticles.filter((article) => tags.some((tag) => article.tags.includes(tag)))
      }

      // Apply pagination to fallback data
      const total = filteredArticles.length
      const paginatedArticles = filteredArticles.slice(offset, offset + limit)

      return NextResponse.json({
        articles: paginatedArticles.map((article) => ({
          ...article,
          categories: article.category, // Map category to categories for consistency
          author: {
            name: article.author.name,
            avatar: article.author.avatar,
          },
          reading_time: article.read_time,
          read_time: article.read_time,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: offset + limit < total,
          hasPrev: page > 1,
        },
      })
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
      articles:
        articles?.map((article) => ({
          ...article,
          author: {
            name: article.author_name,
            avatar: article.author_avatar,
          },
          read_time: article.reading_time,
        })) || [],
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
    console.log("[v0] API error, using fallback articles data")

    const page = Number.parseInt(new URL(request.url).searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(new URL(request.url).searchParams.get("limit") || "12"), 50)
    const offset = (page - 1) * limit

    const paginatedArticles = fallbackArticles.slice(offset, offset + limit)

    return NextResponse.json({
      articles: paginatedArticles.map((article) => ({
        ...article,
        categories: article.category,
        author: {
          name: article.author.name,
          avatar: article.author.avatar,
        },
        reading_time: article.read_time,
        read_time: article.read_time,
      })),
      pagination: {
        page,
        limit,
        total: fallbackArticles.length,
        totalPages: Math.ceil(fallbackArticles.length / limit),
        hasNext: offset + limit < fallbackArticles.length,
        hasPrev: page > 1,
      },
    })
  }
}
