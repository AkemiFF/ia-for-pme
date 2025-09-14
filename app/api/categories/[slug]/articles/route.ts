import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { slug } = params
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "12"), 50)
    const offset = (page - 1) * limit

    // First, get the category
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, name, slug, description, seo_title, seo_description")
      .eq("slug", slug)
      .single()

    if (categoryError || !category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Get articles in this category
    const { data: articles, error: articlesError } = await supabase
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
        view_count
      `)
      .eq("category_id", category.id)
      .eq("published", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (articlesError) {
      console.error("Database error:", articlesError)
      return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }

    // Get total count
    const { count } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("category_id", category.id)
      .eq("published", true)

    return NextResponse.json({
      category,
      articles: articles || [],
      totalArticles: count || 0,
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
