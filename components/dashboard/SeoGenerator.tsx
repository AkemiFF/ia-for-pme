"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SeoGeneratorProps {
  title: string
  excerpt: string
  cover_image?: string
  datePublished?: string
  author?: string
}

interface SeoData {
  metaTitle: string
  metaDescription: string
  ogTitle: string
  ogDescription: string
  twitterTitle: string
  twitterDescription: string
  hashtags: string[]
  jsonLd: string
}

export function SeoGenerator({
  title,
  excerpt,
  cover_image,
  datePublished,
  author = "IA pour PME",
}: SeoGeneratorProps) {
  const [seoData, setSeoData] = useState<SeoData | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Generate SEO data when props change
  useEffect(() => {
    if (!title || !excerpt) return

    const generated = generateSeoData({
      title,
      excerpt,
      cover_image,
      datePublished,
      author,
    })
    setSeoData(generated)
  }, [title, excerpt, cover_image, datePublished, author])

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (!seoData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Générateur SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Remplissez le titre et l'extrait pour générer les métadonnées SEO</p>
        </CardContent>
      </Card>
    )
  }

  const SeoField = ({
    label,
    value,
    field,
    maxLength,
  }: {
    label: string
    value: string
    field: string
    maxLength?: number
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {maxLength && (
            <span className={`ml-2 text-xs ${value.length > maxLength ? "text-red-500" : "text-gray-400"}`}>
              ({value.length}/{maxLength})
            </span>
          )}
        </label>
        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(value, field)} className="h-8 w-8 p-0">
          {copiedField === field ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div
        className={`p-3 bg-gray-50 rounded-md text-sm border ${
          maxLength && value.length > maxLength ? "border-red-200" : "border-gray-200"
        }`}
      >
        {value}
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Métadonnées SEO Générées
        </CardTitle>
        <p className="text-sm text-gray-600">Métadonnées optimisées pour les moteurs de recherche et réseaux sociaux</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meta Tags */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Balises Meta</h3>
          <SeoField label="Meta Title" value={seoData.metaTitle} field="metaTitle" maxLength={60} />
          <SeoField label="Meta Description" value={seoData.metaDescription} field="metaDescription" maxLength={155} />
        </div>

        {/* Open Graph */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Open Graph (Facebook)</h3>
          <SeoField label="OG Title" value={seoData.ogTitle} field="ogTitle" />
          <SeoField label="OG Description" value={seoData.ogDescription} field="ogDescription" />
        </div>

        {/* Twitter Cards */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Twitter Cards</h3>
          <SeoField label="Twitter Title" value={seoData.twitterTitle} field="twitterTitle" />
          <SeoField label="Twitter Description" value={seoData.twitterDescription} field="twitterDescription" />
        </div>

        {/* Hashtags */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Hashtags Suggérés</h3>
          <div className="flex flex-wrap gap-2">
            {seoData.hashtags.map((hashtag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => copyToClipboard(hashtag, `hashtag-${index}`)}
              >
                {hashtag}
              </Badge>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(seoData.hashtags.join(" "), "all-hashtags")}
          >
            {copiedField === "all-hashtags" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copier tous les hashtags
          </Button>
        </div>

        {/* JSON-LD */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">JSON-LD Schema</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Article Schema (JSON-LD)</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(seoData.jsonLd, "jsonLd")}
                className="h-8 w-8 p-0"
              >
                {copiedField === "jsonLd" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <pre className="p-3 bg-gray-50 rounded-md text-xs border border-gray-200 overflow-x-auto">
              {seoData.jsonLd}
            </pre>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Instructions d'intégration</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Ajoutez les meta tags dans le &lt;Head&gt; de votre page</p>
            <p>• Intégrez le JSON-LD dans un &lt;script type="application/ld+json"&gt;</p>
            <p>• Utilisez les hashtags dans vos posts sur les réseaux sociaux</p>
            <p>• Vérifiez les longueurs recommandées (titre ≤60, description ≤155)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to generate SEO data
function generateSeoData({ title, excerpt, cover_image, datePublished, author }: SeoGeneratorProps): SeoData {
  // Clean and optimize title (≤60 chars)
  const cleanTitle = title.trim()
  const metaTitle =
    cleanTitle.length <= 60 ? `${cleanTitle} | IA pour PME` : `${cleanTitle.substring(0, 50)}... | IA pour PME`

  // Clean and optimize description (≤155 chars)
  const cleanExcerpt = excerpt.trim().replace(/\n/g, " ")
  const metaDescription = cleanExcerpt.length <= 155 ? cleanExcerpt : `${cleanExcerpt.substring(0, 150)}...`

  // Open Graph optimizations
  const ogTitle = cleanTitle.length <= 60 ? cleanTitle : cleanTitle.substring(0, 60)
  const ogDescription = cleanExcerpt.length <= 160 ? cleanExcerpt : `${cleanExcerpt.substring(0, 155)}...`

  // Twitter Card optimizations
  const twitterTitle = cleanTitle.length <= 70 ? cleanTitle : cleanTitle.substring(0, 67) + "..."
  const twitterDescription = cleanExcerpt.length <= 200 ? cleanExcerpt : `${cleanExcerpt.substring(0, 195)}...`

  // Generate relevant hashtags
  const hashtags = generateHashtags(title, excerpt)

  // Generate JSON-LD
  const jsonLd = generateJsonLd({
    title: cleanTitle,
    description: cleanExcerpt,
    cover_image,
    datePublished,
    author,
  })

  return {
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    hashtags,
    jsonLd,
  }
}

// Generate relevant hashtags based on content
function generateHashtags(title: string, excerpt: string): string[] {
  const content = `${title} ${excerpt}`.toLowerCase()
  const baseHashtags = ["#IA", "#PME", "#Intelligence", "#Artificielle"]
  const conditionalHashtags: { [key: string]: string } = {
    automation: "#Automatisation",
    productivité: "#Productivité",
    marketing: "#Marketing",
    vente: "#Ventes",
    client: "#ServiceClient",
    données: "#BigData",
    analyse: "#Analytics",
    chatbot: "#Chatbot",
    formation: "#Formation",
    stratégie: "#Stratégie",
    digital: "#Transformation",
    innovation: "#Innovation",
    technologie: "#Tech",
    business: "#Business",
    entrepreneur: "#Entrepreneur",
  }

  const relevantHashtags = Object.entries(conditionalHashtags)
    .filter(([keyword]) => content.includes(keyword))
    .map(([, hashtag]) => hashtag)
    .slice(0, 4) // Limit to 4 conditional hashtags

  return [...baseHashtags, ...relevantHashtags].slice(0, 8) // Max 8 hashtags total
}

// Generate JSON-LD Article schema
export function generateJsonLd({
  title,
  description,
  cover_image,
  datePublished,
  author = "IA pour PME",
}: {
  title: string
  description: string
  cover_image?: string
  datePublished?: string
  author?: string
}): string {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    author: {
      "@type": "Organization",
      name: author,
      url: "https://ia-pour-pme.fr",
    },
    publisher: {
      "@type": "Organization",
      name: "IA pour PME",
      logo: {
        "@type": "ImageObject",
        url: "https://ia-pour-pme.fr/logo.png",
      },
    },
    datePublished: datePublished || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    ...(cover_image && {
      image: {
        "@type": "ImageObject",
        url: cover_image,
        width: 1200,
        height: 630,
      },
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://ia-pour-pme.fr",
    },
  }

  return JSON.stringify(jsonLdData, null, 2)
}

// Export helper for best practices
export const seoOptimizationTips = {
  metaTitle: "Gardez le titre sous 60 caractères pour éviter la troncature dans les SERPs",
  metaDescription: "Limitez la description à 155 caractères pour un affichage optimal",
  openGraph: "Les images OG doivent faire 1200x630px pour un rendu optimal sur Facebook",
  twitterCard: "Utilisez 'summary_large_image' pour les articles avec images",
  jsonLd: "Le JSON-LD améliore la compréhension du contenu par les moteurs de recherche",
  hashtags: "Utilisez 3-5 hashtags pertinents pour maximiser la portée sur les réseaux sociaux",
}
