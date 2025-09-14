export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content?: string
  category: {
    id: number
    name: string
    slug: string
  }
  author: {
    name: string
    avatar?: string
  }
  published_at: string
  read_time: number
  featured: boolean
  sector: string
  budget: string
  level: string
  tags: string[]
  featured_image?: string
  seo_title?: string
  seo_description?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  seo_title?: string
  seo_description?: string
}

export interface FilterOptions {
  sectors?: string[]
  budgets?: string[]
  levels?: string[]
  readTime?: [number, number]
  tags?: string[]
  searchQuery?: string
  category?: string
  page?: number
  limit?: number
}

// Fetch all articles with optional filters
export async function fetchArticles(filters: FilterOptions = {}): Promise<{
  articles: Article[]
  total: number
  page: number
  totalPages: number
}> {
  const params = new URLSearchParams()

  if (filters.sectors?.length) params.append("sectors", filters.sectors.join(","))
  if (filters.budgets?.length) params.append("budgets", filters.budgets.join(","))
  if (filters.levels?.length) params.append("levels", filters.levels.join(","))
  if (filters.readTime) {
    params.append("readTimeMin", filters.readTime[0].toString())
    params.append("readTimeMax", filters.readTime[1].toString())
  }
  if (filters.tags?.length) params.append("tags", filters.tags.join(","))
  if (filters.searchQuery) params.append("search", filters.searchQuery)
  if (filters.category) params.append("category", filters.category)
  if (filters.page) params.append("page", filters.page.toString())
  if (filters.limit) params.append("limit", filters.limit.toString())

  const response = await fetch(`/api/articles?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch articles")
  }

  const data = await response.json()

  const transformedArticles = (data.articles || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    category: article.categories || { id: 0, name: "Non catégorisé", slug: "non-categorise" },
    author: {
      name: article.author_name || "IA pour PME",
      avatar: article.author_avatar,
    },
    published_at: article.published_at,
    read_time: article.reading_time || 1,
    featured: article.featured || false,
    sector: article.sector || "",
    budget: article.budget || "",
    level: article.level || "",
    tags: article.tags || [],
    featured_image: article.featured_image,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
  }))

  return {
    articles: transformedArticles,
    total: data.pagination?.total || 0,
    page: data.pagination?.page || 1,
    totalPages: data.pagination?.totalPages || 1,
  }
}

// Fetch single article by slug
export async function fetchArticle(slug: string): Promise<Article> {
  const response = await fetch(`/api/articles/${slug}`)

  if (!response.ok) {
    throw new Error("Failed to fetch article")
  }

  const data = await response.json()

  const article = data.article || data

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    category: article.categories || article.category || { id: 0, name: "Non catégorisé", slug: "non-categorise" },
    author: {
      name: article.author_name || article.author?.name || "IA pour PME",
      avatar: article.author_avatar || article.author?.avatar,
    },
    published_at: article.published_at || article.publishedAt,
    read_time: article.reading_time || article.read_time || 1,
    featured: article.featured || false,
    sector: article.sector || "",
    budget: article.budget || "",
    level: article.level || "",
    tags: article.tags || [],
    featured_image: article.featured_image || article.featuredImage,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
  }
}

// Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories")

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  return response.json()
}

// Fetch articles by category
export async function fetchCategoryArticles(
  categorySlug: string,
  filters: FilterOptions = {},
): Promise<{
  category: Category
  articles: Article[]
  total: number
  page: number
  totalPages: number
}> {
  const params = new URLSearchParams()

  if (filters.page) params.append("page", filters.page.toString())
  if (filters.limit) params.append("limit", filters.limit.toString())
  if (filters.searchQuery) params.append("search", filters.searchQuery)

  const response = await fetch(`/api/categories/${categorySlug}/articles?${params.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch category articles")
  }

  return response.json()
}

export async function fetchRecommendedArticles(
  currentArticleId?: number,
  category?: string,
  tags?: string[],
  limit = 4,
): Promise<Article[]> {
  const params = new URLSearchParams()

  if (currentArticleId) params.append("exclude", currentArticleId.toString())
  if (category) params.append("category", category)
  if (tags?.length) params.append("tags", tags.join(","))
  params.append("limit", limit.toString())
  params.append("featured", "true") // Prioritize featured articles

  const response = await fetch(`/api/articles/recommendations?${params.toString()}`)

  if (!response.ok) {
    // Fallback to regular articles if recommendations fail
    const fallbackResponse = await fetchArticles({ limit })
    return fallbackResponse.articles
  }

  const data = await response.json()

  return (data.articles || []).map((article: any) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.categories || { id: 0, name: "Non catégorisé", slug: "non-categorise" },
    author: {
      name: article.author_name || "IA pour PME",
      avatar: article.author_avatar,
    },
    published_at: article.published_at,
    read_time: article.reading_time || 1,
    featured: article.featured || false,
    sector: article.sector || "",
    budget: article.budget || "",
    level: article.level || "",
    tags: article.tags || [],
    featured_image: article.featured_image,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
  }))
}
