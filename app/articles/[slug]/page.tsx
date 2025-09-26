import { fetchArticle } from "@/lib/api/articles"
import type { Article } from "@/types"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ArticleContent from "./ArticleContent"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/articles?limit=100`)

    if (!response.ok) {
      console.warn("Failed to fetch articles for static generation")
      return []
    }

    const data = await response.json()
    const articles = data.articles || []

    return articles.map((article: Article) => ({
      slug: article.slug,
    }))
  } catch (error) {
    console.error("Error fetching articles for static paths:", error)
    // Fallback data for development
    return [
      { slug: "automatiser-service-client-ia-2024" },
      { slug: "10-outils-ia-gratuits-productivite" },
      { slug: "roi-ia-mesurer-impact-pme" },
      { slug: "ia-rgpd-guide-conformite-pme" },
      { slug: "formation-ia-preparer-equipes" },
    ]
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    const article = await fetchArticle(params.slug)

    const title = article.seo_title || article.title
    const description = article.seo_description || article.excerpt

    return {
      title: title.length > 60 ? title.substring(0, 57) + "..." : title,
      description: description.length > 155 ? description.substring(0, 152) + "..." : description,
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: article.published_at,
        authors: [article.author.name],
        images: article.featured_image
          ? [
              {
                url: article.featured_image,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ]
          : [],
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${params.slug}`,
        siteName: "IA pour PME",
        locale: "fr_FR",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: article.featured_image ? [article.featured_image] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${params.slug}`,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Article non trouvé - IA pour PME",
      description: "Cet article n'existe pas ou a été supprimé.",
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    const article = await fetchArticle(params.slug)
    // Ensure 'content' is always a string
    return <ArticleContent article={{ ...article, content: article.content ?? "" }} />
  } catch (error) {
    console.error("Error loading article:", error)
    notFound()
  }
}

export const revalidate = 60
