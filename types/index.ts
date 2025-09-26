// Main types for the application - centralized in /types directory

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  seo_title?: string
  seo_description?: string
  articleCount?: number
}

export interface Author {
  name: string
  avatar?: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content?: string
  category: Category
  author: Author
  published_at: string
  reading_time: number
  read_time: number // Ensure both properties are always numbers
  featured: boolean
  sector: string
  budget: string
  level: string
  tags: string[]
  featured_image?: string
  seo_title?: string
  seo_description?: string
  faq?: FAQ[] // Added FAQ property to Article interface
  updated_at?: string // Added updated_at property used in schema generation
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

export interface ArticlesResponse {
  articles: Article[]
  total: number
  page: number
  totalPages: number
}

export interface CategoryArticlesResponse {
  category: Category
  articles: Article[]
  total: number
  page: number
  totalPages: number
}

export interface AffiliateResource {
  id: number
  name: string
  description: string
  url: string
  logo?: string
}

// Newsletter and Lead Magnet types
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

// Analytics types
export interface AnalyticsEvent {
  id: string
  event_type: string
  event_data: Record<string, any>
  user_agent?: string
  ip_address?: string
  referrer?: string
  created_at: string
}
