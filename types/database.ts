// Database types for TypeScript support

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  seo_title?: string
  seo_description?: string
  created_at: string
  updated_at: string
  articleCount?: number
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  category_id?: string
  author_name: string
  author_avatar?: string
  published_at?: string
  updated_at: string
  reading_time: number
  tags: string[]
  featured_image?: string // Standardized to featured_image instead of cover_image_url
  affiliate_links: AffiliateLink[]
  featured: boolean
  sector: "pme" | "freelance" | "ecommerce"
  budget: "gratuit" | "petit" | "moyen" | "eleve"
  level: "debutant" | "intermediaire" | "expert"
  published: boolean
  view_count: number
  created_at: string
  categories?: Category
  author?: {
    name: string
    avatar?: string
  }
  read_time?: number
  category?: Category
}

export interface AffiliateLink {
  name: string
  url: string
  description?: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  segments: string[]
  interests: string[]
  source: string
  subscribed_at: string
  is_active: boolean
  unsubscribed_at?: string
  mailerlite_id?: string
}

export interface LeadMagnet {
  id: string
  name: string
  email: string
  source: string
  download_url?: string
  created_at: string
  mailerlite_id?: string
}

export interface AffiliateResource {
  id: string
  name: string
  description?: string
  url: string
  affiliate_link?: string
  logo_url?: string
  category?: string
  pricing?: string
  featured: boolean
  click_count: number
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  event_data: Record<string, any>
  user_agent?: string
  ip_address?: string
  referrer?: string
  created_at: string
}

// API Response types
export interface ArticlesResponse {
  articles: Article[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ArticleResponse {
  article: Article
  relatedArticles: Article[]
}

export interface CategoriesResponse {
  categories: Category[]
}

export interface CategoryArticlesResponse {
  category: Category
  articles: Article[]
  totalArticles: number
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface AffiliatesResponse {
  affiliates: AffiliateResource[]
}
