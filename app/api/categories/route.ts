import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fallbackCategories, fallbackArticles } from "@/lib/data/fallback-articles"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get categories with article counts
    const { data: categories, error } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        slug,
        description,
        seo_title,
        seo_description,
        articles!inner(count)
      `)
      .order("name")

    if (error || !categories || categories.length === 0) {
      console.log("[v0] Using fallback categories data")

      // Calculate article counts for fallback categories
      const categoriesWithCounts = fallbackCategories.map((category) => ({
        ...category,
        articleCount: fallbackArticles.filter((article) => article.category.slug === category.slug).length,
      }))

      return NextResponse.json({
        categories: categoriesWithCounts,
      })
    }

    // Transform data to include article counts
    const categoriesWithCounts = categories?.map((category) => ({
      ...category,
      articleCount: category.articles?.length || 0,
      articles: undefined, // Remove the articles array
    }))

    return NextResponse.json({
      categories: categoriesWithCounts || [],
    })
  } catch (error) {
    console.error("API error:", error)
    console.log("[v0] API error, using fallback categories data")

    const categoriesWithCounts = fallbackCategories.map((category) => ({
      ...category,
      articleCount: fallbackArticles.filter((article) => article.category.slug === category.slug).length,
    }))

    return NextResponse.json({
      categories: categoriesWithCounts,
    })
  }
}
