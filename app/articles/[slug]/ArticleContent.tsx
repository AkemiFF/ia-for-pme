"use client"

import { useState, useEffect } from "react"
import DOMPurify from "dompurify"

interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
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
  updated_at?: string
  read_time?: number
  tags?: string[]
  faq?: {
    question: string
    answer: string
  }[]
  featured_image?: string
}

function calculateReadingTime(content: string): number {
  if (!content || typeof content !== "string") {
    return 1 // Default to 1 minute if content is invalid
  }

  const wordsPerMinute = 200
  const textContent = content.replace(/<[^>]*>/g, "") // Remove HTML tags
  const wordCount = textContent.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function formatDate(dateString: string): string {
  if (!dateString) {
    return "Date non disponible"
  }

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.log("[v0] Invalid date string:", dateString)
    return "Date non disponible"
  }

  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function insertAdSlots(content: string): string {
  // SECURITY WARNING: This function uses dangerouslySetInnerHTML without sanitization
  // TODO: URGENT - Implement DOMPurify to sanitize HTML content before rendering
  // Current implementation is vulnerable to XSS attacks if content comes from user input

  // Insert ad after first paragraph
  const firstParagraphRegex = /(<p>.*?<\/p>)/
  let processedContent = content.replace(firstParagraphRegex, "$1\n<!-- AD_SLOT_INLINE -->")

  // Insert ads between H2 sections
  const h2Regex = /(<h2>.*?<\/h2>)/g
  let h2Count = 0
  processedContent = processedContent.replace(h2Regex, (match) => {
    h2Count++
    if (h2Count === 2 || h2Count === 4) {
      return `<!-- AD_SLOT_SECTION -->\n${match}`
    }
    return match
  })

  return processedContent
}

function AdSlot({ type, className = "" }: { type: "inline" | "section"; className?: string }) {
  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center my-6 ${className}`}>
      <div className="text-gray-500 text-sm font-medium">
        {type === "inline" ? "PUBLICITÉ INLINE" : "PUBLICITÉ SECTION"}
      </div>
      <div className="text-gray-400 text-xs mt-1">
        {/* TODO: Intégrer Google AdSense ou autre régie publicitaire */}
        Espace publicitaire - {type === "inline" ? "728x90" : "300x250"}
      </div>
    </div>
  )
}

function AffiliateToolsSection() {
  // TODO: Replace with actual affiliate links from environment variables
  const affiliateUrl = process.env.NEXT_PUBLIC_AFFILIATE_DEFAULT || "#"

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🛠️ Outils recommandés</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div>
            <h4 className="font-semibold text-gray-900">ChatBot Pro</h4>
            <p className="text-gray-600 text-sm">Solution IA complète pour automatiser votre service client</p>
          </div>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {/* TODO: Ajouter tracking des clics affiliés */}
            Essayer gratuitement
          </a>
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
          <div>
            <h4 className="font-semibold text-gray-900">AI Assistant Suite</h4>
            <p className="text-gray-600 text-sm">Plateforme tout-en-un pour l'automatisation IA</p>
          </div>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Découvrir l'offre
          </a>
        </div>
      </div>
    </div>
  )
}

function FAQSection({ faq }: { faq: Article["faq"] }) {
  if (!faq || faq.length === 0) return null

  return (
    <div className="bg-gray-50 rounded-lg p-6 my-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">❓ Questions fréquentes</h3>
      <div className="space-y-4">
        {faq.map((item, index) => (
          <details key={index} className="bg-white rounded-lg border p-4">
            <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
              {item.question}
            </summary>
            <div className="mt-3 text-gray-700 leading-relaxed">{item.answer}</div>
          </details>
        ))}
      </div>
    </div>
  )
}

function generateArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Person",
      name: article.author?.name || "IA pour PME",
    },
    publisher: {
      "@type": "Organization",
      name: "IA pour PME",
      logo: {
        "@type": "ImageObject",
        url: "/ia-pme-logo.jpg",
      },
    },
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    image: article.featured_image || "/ai-business-article.jpg",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ia-pme.com/articles/${article.slug}`,
    },
  }
}

function renderMarkdown(markdown: string): string {
  if (!markdown) return ""

  // Basic markdown to HTML conversion
  const html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-6">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-8">$1</h1>')

    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

    // Links - Fixed regex escaping
    .replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // Lists
    .replace(/^\* (.*$)/gim, '<li class="mb-2">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="mb-2">$1</li>')

    // Paragraphs (split by double newlines)
    .split("\n\n")
    .map((paragraph) => {
      paragraph = paragraph.trim()
      if (!paragraph) return ""

      // Don't wrap headers, lists in paragraphs
      if (
        paragraph.startsWith("<h") ||
        paragraph.startsWith("<li") ||
        paragraph.startsWith("<ul") ||
        paragraph.startsWith("<ol")
      ) {
        return paragraph
      }

      // Wrap lists
      if (paragraph.includes("<li")) {
        return `<ul class="list-disc list-inside space-y-2 mb-6">${paragraph}</ul>`
      }

      return `<p class="mb-6 text-gray-700 leading-relaxed">${paragraph}</p>`
    })
    .join("\n")

  return html
}

export default function ArticleContent({ article }: { article: Article }) {
  const [renderedContent, setRenderedContent] = useState<string>("")

  useEffect(() => {
    if (article.content) {
      const htmlContent = renderMarkdown(article.content)
      const processedContent = insertAdSlots(htmlContent)
      const sanitizedContent = DOMPurify.sanitize(processedContent)
      setRenderedContent(sanitizedContent)
    }
  }, [article.content])

  const readingTime = article.read_time || calculateReadingTime(article.content || "")

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema(article)),
        }}
      />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              {article.author?.avatar && (
                <img
                  src={article.author.avatar || "/professional-woman-avatar.png"}
                  alt={article.author?.name || "Auteur"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="font-medium">{article.author?.name || "IA pour PME"}</span>
            </div>

            <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>

            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {readingTime} min de lecture
            </span>
          </div>

          {article.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {article.featured_image && (
            <img
              src={article.featured_image || "/ai-business-article.jpg"}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {renderedContent ? (
            <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
          ) : (
            <div className="text-gray-500 italic">Chargement du contenu...</div>
          )}
        </div>

        {/* Insert Ad Slots */}
        <div className="ad-slots">
          <style jsx>{`
            :global(.ad-slot-inline) {
              display: none;
            }
            :global(.ad-slot-section) {
              display: none;
            }
          `}</style>
        </div>

        {/* Render actual ad components */}
        <AdSlot type="inline" />
        <AdSlot type="section" />

        {/* Affiliate Tools Section */}
        <AffiliateToolsSection />

        {/* FAQ Section */}
        <FAQSection faq={article.faq} />

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cet article vous a été utile ?</h3>
            <p className="text-gray-700 mb-4">
              Découvrez nos autres guides sur l'IA pour les PME et restez informé des dernières innovations.
            </p>
            <div className="flex gap-4">
              <a
                href="/articles"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Voir tous les articles
              </a>
              <a
                href="/lead-magnet"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Guide gratuit IA
              </a>
            </div>
          </div>
        </footer>
      </article>
    </>
  )
}
