import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // TODO: Add proper JWT token validation here
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 50)
    const search = searchParams.get("search")
    const offset = (page - 1) * limit

    let query = supabase
      .from("articles")
      .select(`
        id,
        title,
        slug,
        published,
        created_at,
        updated_at,
        categories(
          id,
          name,
          slug
        )
      `)
      .order("created_at", { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    const { data: articles, error } = await query.range(offset, offset + limit - 1)
    const { count } = await supabase.from("articles").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }

    // Transform data to match dashboard expectations
    const transformedArticles =
      articles?.map((article) => ({
        id: article.id.toString(),
        title: article.title,
        slug: article.slug,
        status: article.published ? "published" : "draft",
        created_at: article.created_at,
        updated_at: article.updated_at,
        category: {
          name: article.categories?.name || "Non catégorisé",
        },
      })) || []

    return NextResponse.json({
      articles: transformedArticles,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // TODO: Add proper JWT token validation here
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, category_id, tags, cover_image_url, published, affiliate_links } = body

    // Basic validation
    if (!title || !content || !category_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Parse tags and affiliate_links
    const tagsArray = tags ? tags.split(",").map((tag: string) => tag.trim()) : []
    let affiliateLinksJson = null

    if (affiliate_links) {
      try {
        affiliateLinksJson = JSON.parse(affiliate_links)
      } catch (e) {
        return NextResponse.json({ error: "Invalid affiliate links JSON" }, { status: 400 })
      }
    }

    const { data: article, error } = await supabase
      .from("articles")
      .insert({
        title,
        slug,
        excerpt,
        content,
        category_id: Number.parseInt(category_id),
        tags: tagsArray,
        featured_image: cover_image_url,
        published: Boolean(published),
        affiliate_links: affiliateLinksJson,
        author_name: "Admin", // TODO: Get from authenticated user
        published_at: published ? new Date().toISOString() : null,
        reading_time: Math.ceil(content.split(" ").length / 200), // Estimate reading time
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      article,
      slug: article.slug,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
