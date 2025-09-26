// Article sections types

export type SectionType =
  | "texte_markdown"
  | "image"
  | "video"
  | "produit_affilie"
  | "fichier"
  | "galerie"
  | "citation"
  | "code"

export type SectionAlignment = "left" | "right" | "center"

export interface BaseSection {
  id: string
  article_id: string
  section_type: SectionType
  order_index: number
  title?: string
  alignment: SectionAlignment
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface TextMarkdownSection extends BaseSection {
  section_type: "texte_markdown"
  content: {
    markdown: string
  }
}

export interface ImageSection extends BaseSection {
  section_type: "image"
  content: {
    url: string
    alt_text: string
    caption?: string
  }
}

export interface VideoSection extends BaseSection {
  section_type: "video"
  content: {
    url: string
    thumbnail?: string
    duration?: number
    caption?: string
  }
}

export interface ProductAffiliateSection extends BaseSection {
  section_type: "produit_affilie"
  content: {
    product_name: string
    product_url: string
    affiliate_url: string
    image_url?: string
    price?: string
    description?: string
  }
}

export interface FileSection extends BaseSection {
  section_type: "fichier"
  content: {
    file_url: string
    file_name: string
    file_size: number
    file_type: string
  }
}

export interface GallerySection extends BaseSection {
  section_type: "galerie"
  content: {
    images: Array<{
      url: string
      alt_text: string
      caption?: string
    }>
  }
}

export interface QuoteSection extends BaseSection {
  section_type: "citation"
  content: {
    quote: string
    author?: string
    source?: string
  }
}

export interface CodeSection extends BaseSection {
  section_type: "code"
  content: {
    code: string
    language?: string
    filename?: string
  }
}

export type ArticleSection =
  | TextMarkdownSection
  | ImageSection
  | VideoSection
  | ProductAffiliateSection
  | FileSection
  | GallerySection
  | QuoteSection
  | CodeSection

export type ArticleSectionContent =
  | { markdown: string }
  | { url: string; alt_text: string; caption?: string }
  | { url: string; thumbnail?: string; duration?: number; caption?: string }
  | {
      product_name: string
      product_url: string
      affiliate_url: string
      image_url?: string
      price?: string
      description: string
    }
  | { file_url: string; file_name: string; file_size?: number; file_type?: string }
  | { images: Array<{ url: string; alt_text: string; caption?: string }> }
  | { quote: string; author?: string; source?: string }
  | { code: string; language?: string; filename?: string }

export interface SectionFormData {
  section_type: SectionType
  title?: string
  alignment: SectionAlignment
  content: Record<string, any>
  metadata?: Record<string, any>
}
