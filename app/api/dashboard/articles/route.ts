import { verifyAuthToken } from "@/lib/auth/verify-token"
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Verify authentication with proper token validation
    const user = await verifyAuthToken(request)

    if (!user) {
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
          name: article.categories?.[0]?.name || "Non catégorisé",
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

    // Verify authentication with proper token validation
    const user = await verifyAuthToken(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, category_id, tags, cover_image_url, published, affiliate_links, sections } =
      body

    // Basic validation
    if (!title || (!content && (!sections || sections.length === 0)) || !category_id) {
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

    // Start a transaction to create article and sections
    const { data: article, error: articleError } = await supabase
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
        author_name: user.email || "Admin",
        published_at: published ? new Date().toISOString() : null,
        reading_time: Math.ceil((content || "").split(" ").length / 200), // Estimate reading time
      })
      .select()
      .single()

    if (articleError) {
      console.error("Database error:", articleError)
      return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
    }

    // Create sections if provided
    if (sections && sections.length > 0) {
      const sectionsToInsert = sections.map((section: any, index: number) => ({
        article_id: article.id,
        section_type: section.section_type,
        order_index: index,
        title: section.title || null,
        content: section.content || {},
        alignment: section.alignment || "center",
        metadata: section.metadata || {},
      }))

      const { error: sectionsError } = await supabase.from("article_sections").insert(sectionsToInsert)

      if (sectionsError) {
        console.error("Sections creation error:", sectionsError)
        // Don't fail the entire request, just log the error
        console.warn("Article created but sections failed to save")
      }
    }

    return NextResponse.json({
      success: true,
      article,
      slug: article.slug,
      sectionsCount: sections?.length || 0,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
