import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fallbackArticles } from "@/lib/data/fallback-articles"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
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
    const { data: featuredArticles, error } = await query.eq("featured", true).limit(limit)

    if (error || !featuredArticles || featuredArticles.length === 0) {
      console.log("[v0] Using fallback recommendations data")

      let recommendations = [...fallbackArticles]

      // Apply same filtering logic to fallback data
      if (excludeId) {
        const excludeIdNum = Number.parseInt(excludeId)
        recommendations = recommendations.filter((article) => article.id !== excludeIdNum)
      }

      if (category) {
        const categoryRecommendations = recommendations.filter((article) => article.category.slug === category)
        if (categoryRecommendations.length > 0) {
          recommendations = categoryRecommendations
        }
      }

      if (tags.length > 0) {
        const tagRecommendations = recommendations.filter((article) => tags.some((tag) => article.tags.includes(tag)))
        if (tagRecommendations.length > 0) {
          recommendations = tagRecommendations
        }
      }

      // Prioritize featured articles
      recommendations.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })

      const limitedRecommendations = recommendations.slice(0, limit).map((article) => ({
        ...article,
        categories: article.category,
        author_name: article.author.name,
        author_avatar: article.author.avatar,
        reading_time: article.read_time,
      }))

      return NextResponse.json({ articles: limitedRecommendations })
    }

    return NextResponse.json({ articles: featuredArticles || [] })
  } catch (error) {
    console.error("Error in recommendations API:", error)
    console.log("[v0] API error, using fallback recommendations data")

    const limit = Number.parseInt(new URL(request.url).searchParams.get("limit") || "4")
    const featuredFallback = fallbackArticles
      .filter((article) => article.featured)
      .slice(0, limit)
      .map((article) => ({
        ...article,
        categories: article.category,
        author_name: article.author.name,
        author_avatar: article.author.avatar,
        reading_time: article.read_time,
      }))

    return NextResponse.json({ articles: featuredFallback })
  }
}
