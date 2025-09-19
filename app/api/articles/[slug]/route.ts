import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { slug } = params

    console.log(`[v0] Fetching article with slug: ${slug}`)

    // Fetch article with category info
    const { data: article, error } = await supabase
      .from("articles")
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        author_name,
        author_avatar,
        published_at,
        updated_at,
        reading_time,
        tags,
        featured_image,
        affiliate_links,
        featured,
        sector,
        budget,
        level,
        view_count,
        categories(
          id,
          name,
          slug
        )
      `)
      .eq("slug", slug)
      .eq("published", true)
      .single()

    console.log(`[v0] Article query result:`, { article, error })

    if (error || !article) {
      console.log(`[v0] Article not found for slug: ${slug}`)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Increment view count
    await supabase
      .from("articles")
      .update({ view_count: (article.view_count || 0) + 1 })
      .eq("id", article.id)

    // Get related articles (same category, excluding current)
    const { data: relatedArticles } = await supabase
      .from("articles")
      .select(`
        id,
        title,
        slug,
        excerpt,
        author_name,
        published_at,
        reading_time,
        featured_image,
        categories(name, slug)
      `)
      .eq("category_id", article.categories?.id)
      .eq("published", true)
      .neq("id", article.id)
      .order("published_at", { ascending: false })
      .limit(3)

    // Track analytics
    await supabase.from("analytics_events").insert({
      event_type: "article_view",
      event_data: {
        article_id: article.id,
        article_slug: slug,
        category: article.categories?.slug,
      },
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    })

    return NextResponse.json({
      article,
      relatedArticles: relatedArticles || [],
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
