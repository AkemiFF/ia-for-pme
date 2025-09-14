"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

interface Category {
  id: number
  name: string
  slug: string
  description: string
}

interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  published_at: string
  read_time: number
  featured_image?: string
}

interface AffiliateResource {
  id: number
  name: string
  description: string
  url: string
  logo?: string
}

interface CategoryContentProps {
  category: Category
  articles: Article[]
  totalArticles: number
  affiliateResources: AffiliateResource[]
}

export default function CategoryContent({
  category,
  articles,
  totalArticles,
  affiliateResources,
}: CategoryContentProps) {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  // Pagination simple côté client
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 10
  const totalPages = Math.ceil(totalArticles / articlesPerPage)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    // TODO: Intégrer avec MailerLite ou votre service d'email
    console.log("[v0] Newsletter subscription:", email)

    // Simulation d'appel API
    setTimeout(() => {
      setIsSubscribing(false)
      setEmail("")
      alert("Merci pour votre inscription !")
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/categories" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Catégories
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{category.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            {/* En-tête de catégorie */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{category.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">{category.description}</p>
            </div>

            {/* Ad placeholder */}
            <div className="mb-8 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500 font-medium">📢 Espace publicitaire - Bannière catégorie</p>
              <p className="text-sm text-gray-400 mt-1">
                {/* TODO: Intégrer Google Ads ou autre régie publicitaire */}
                Dimensions recommandées : 728x90 (leaderboard)
              </p>
            </div>

            {/* Grille d'articles */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Articles ({totalArticles})</h2>
                {totalPages > 1 && (
                  <div className="text-sm text-gray-500">
                    Page {currentPage} sur {totalPages}
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {article.featured_image && (
                      <div className="aspect-video relative">
                        <Image
                          src={article.featured_image || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {article.read_time} min de lecture
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination simple */}
              {totalPages > 1 && (
                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">Plus d'articles à venir dans cette catégorie</p>
                  {/* TODO: Implémenter pagination complète avec navigation */}
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } transition-colors`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-8 space-y-6">
              {/* Top 5 ressources affiliées */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Outils recommandés</h3>
                <div className="space-y-4">
                  {affiliateResources.map((resource) => (
                    <div key={resource.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded border border-gray-200 flex items-center justify-center">
                        {resource.logo ? (
                          <Image
                            src={resource.logo || "/placeholder.svg"}
                            alt={resource.name}
                            width={20}
                            height={20}
                            className="rounded"
                          />
                        ) : (
                          <div className="w-4 h-4 bg-blue-100 rounded"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {resource.name}
                        </a>
                        <p className="text-xs text-gray-500 mt-1">{resource.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  {/* TODO: Ajouter disclaimer légal pour liens affiliés */}* Liens affiliés - nous touchons une
                  commission
                </p>
              </div>

              {/* CTA Newsletter */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📧 Newsletter IA</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recevez nos derniers articles et conseils IA directement dans votre boîte mail.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Adresse email pour la newsletter"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubscribing ? "Inscription..." : "S'abonner gratuitement"}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">Pas de spam, désinscription en 1 clic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
