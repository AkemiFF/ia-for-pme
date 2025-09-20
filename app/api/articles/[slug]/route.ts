import { fallbackArticles } from "@/lib/data/fallback-articles"
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
interface RelatedArticle {
  id: number
  title: string
  slug: string
  excerpt: string
  author_name: string
  published_at: string
  reading_time: number
  featured_image: string | null
  categories: {
    name: string
    slug: string
  } | {
    id: number
    name: string
    slug: string
  }
}
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
      console.log(`[v0] Article not found in database, checking fallback data for slug: ${slug}`)

      const fallbackArticle = fallbackArticles.find((a) => a.slug === slug)

      if (fallbackArticle) {
        console.log(`[v0] Found fallback article for slug: ${slug}`)

        // Get related articles from fallback data (same category)
        const relatedArticles = fallbackArticles
          .filter((a) => a.slug !== slug && a.category.slug === fallbackArticle.category.slug)
          .slice(0, 3)
          .map((article) => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            author_name: article.author.name,
            published_at: article.published_at,
            reading_time: article.read_time,
            featured_image: article.featured_image,
            categories: article.category,
          }))

        return NextResponse.json({
          article: {
            ...fallbackArticle,
            categories: fallbackArticle.category,
            author_name: fallbackArticle.author.name,
            author_avatar: fallbackArticle.author.avatar,
            reading_time: fallbackArticle.read_time,
            view_count: 0,
            updated_at: fallbackArticle.published_at,
            affiliate_links: null,
          },
          relatedArticles,
        })
      }

      console.log(`[v0] Article not found for slug: ${slug}`)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Increment view count
    try {
      await supabase
        .from("articles")
        .update({ view_count: (article.view_count || 0) + 1 })
        .eq("id", article.id)
    } catch (updateError) {
      console.warn("[v0] Failed to update view count:", updateError)
      // Don't fail the request if view count update fails
    }

    // Get related articles (same category, excluding current)
    let categoryId: any = null
    let categorySlug: string | null = null

    if (article.categories) {
      if (Array.isArray(article.categories) && article.categories.length > 0) {
        categoryId = article.categories[0].id
        categorySlug = article.categories[0].slug
      } else if (article.categories && typeof article.categories === "object") {
        categoryId = (article.categories as any).id
        categorySlug = (article.categories as any).slug
      }
    }



    let relatedArticles: RelatedArticle[] = []
    if (categoryId) {
      const { data: related } = await supabase
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
        .eq("category_id", categoryId)
        .eq("published", true)
        .neq("id", article.id)
        .order("published_at", { ascending: false })
        .limit(3)

      relatedArticles = (related || []).map((item: any) => ({
        ...item,
        categories: Array.isArray(item.categories) ? item.categories[0] : item.categories
      }))
    }

    try {
      await supabase.from("analytics_events").insert({
        event_type: "article_view",
        event_data: {
          article_id: article.id,
          article_slug: slug,
          category: categorySlug,
        },
        user_agent: request.headers.get("user-agent"),
        referrer: request.headers.get("referer"),
      })
    } catch (analyticsError) {
      console.warn("[v0] Analytics tracking failed:", analyticsError)
      // Don't fail the request if analytics fails
    }

    return NextResponse.json({
      article,
      relatedArticles,
    })
  } catch (error) {
    console.error("[v0] API error:", error)

    console.log(`[v0] API error, checking fallback data for slug: ${params.slug}`)

    const fallbackArticle = fallbackArticles.find((a) => a.slug === params.slug)

    if (fallbackArticle) {
      console.log(`[v0] Found fallback article for slug: ${params.slug}`)

      const relatedArticles = fallbackArticles
        .filter((a) => a.slug !== params.slug && a.category.slug === fallbackArticle.category.slug)
        .slice(0, 3)
        .map((article) => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          author_name: article.author.name,
          published_at: article.published_at,
          reading_time: article.read_time,
          featured_image: article.featured_image,
          categories: article.category,
        }))

      return NextResponse.json({
        article: {
          ...fallbackArticle,
          categories: fallbackArticle.category,
          author_name: fallbackArticle.author.name,
          author_avatar: fallbackArticle.author.avatar,
          reading_time: fallbackArticle.read_time,
          view_count: 0,
          updated_at: fallbackArticle.published_at,
          affiliate_links: null,
        },
        relatedArticles,
      })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
