import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
