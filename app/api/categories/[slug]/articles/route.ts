import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fallbackCategories, fallbackArticles } from "@/lib/data/fallback-articles"

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
      console.log(`[v0] Category not found in database, checking fallback data for slug: ${slug}`)

      const fallbackCategory = fallbackCategories.find((c) => c.slug === slug)

      if (fallbackCategory) {
        console.log(`[v0] Found fallback category for slug: ${slug}`)

        // Get articles for this category from fallback data
        const categoryArticles = fallbackArticles.filter((article) => article.category.slug === slug)

        // Apply pagination to fallback data
        const total = categoryArticles.length
        const paginatedArticles = categoryArticles.slice(offset, offset + limit)

        return NextResponse.json({
          category: fallbackCategory,
          articles: paginatedArticles.map((article) => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            author_name: article.author.name,
            author_avatar: article.author.avatar,
            published_at: article.published_at,
            reading_time: article.read_time,
            tags: article.tags,
            featured_image: article.featured_image,
            featured: article.featured,
            sector: article.sector,
            budget: article.budget,
            level: article.level,
            view_count: 0,
          })),
          totalArticles: total,
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

    if (articlesError || !articles || articles.length === 0) {
      console.log(`[v0] Using fallback articles for category: ${slug}`)

      const categoryArticles = fallbackArticles.filter((article) => article.category.slug === slug)
      const total = categoryArticles.length
      const paginatedArticles = categoryArticles.slice(offset, offset + limit)

      return NextResponse.json({
        category,
        articles: paginatedArticles.map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          author_name: article.author.name,
          author_avatar: article.author.avatar,
          published_at: article.published_at,
          reading_time: article.read_time,
          tags: article.tags,
          featured_image: article.featured_image,
          featured: article.featured,
          sector: article.sector,
          budget: article.budget,
          level: article.level,
          view_count: 0,
        })),
        totalArticles: total,
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
    console.log(`[v0] API error, using fallback data for category: ${params.slug}`)

    const fallbackCategory = fallbackCategories.find((c) => c.slug === params.slug)

    if (fallbackCategory) {
      const page = Number.parseInt(new URL(request.url).searchParams.get("page") || "1")
      const limit = Math.min(Number.parseInt(new URL(request.url).searchParams.get("limit") || "12"), 50)
      const offset = (page - 1) * limit

      const categoryArticles = fallbackArticles.filter((article) => article.category.slug === params.slug)
      const total = categoryArticles.length
      const paginatedArticles = categoryArticles.slice(offset, offset + limit)

      return NextResponse.json({
        category: fallbackCategory,
        articles: paginatedArticles.map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          author_name: article.author.name,
          author_avatar: article.author.avatar,
          published_at: article.published_at,
          reading_time: article.read_time,
          tags: article.tags,
          featured_image: article.featured_image,
          featured: article.featured,
          sector: article.sector,
          budget: article.budget,
          level: article.level,
          view_count: 0,
        })),
        totalArticles: total,
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

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
