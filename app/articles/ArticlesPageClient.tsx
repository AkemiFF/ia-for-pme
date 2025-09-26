"use client"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import AdvancedFilters, { type FilterOptions } from "@/components/filters/AdvancedFilters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchArticles, fetchRecommendedArticles } from "@/lib/api/articles"
import type { Article } from "@/types"
import { ArrowRight, Calendar, Clock, Search, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ArticlesPageClient() {
  const [articles, setArticles] = useState<Article[]>([])
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalArticles, setTotalArticles] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<FilterOptions>({
    sectors: [],
    budgets: [],
    levels: [],
    readTime: [5, 30] as [number, number],
    tags: [],
    searchQuery: "",
  })

  const loadArticles = async (newFilters: FilterOptions = filters, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchArticles({
        ...newFilters,
        readTime: [newFilters.readTime[0] ?? 5, newFilters.readTime[1] ?? 30] as [number, number],
        page,
        limit: 12,
      })

      setArticles(data.articles)
      setTotalArticles(data.total)
      setCurrentPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError("Erreur lors du chargement des articles")
      console.error("Error loading articles:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadRecommendedArticles = async () => {
    try {
      const recommended = await fetchRecommendedArticles(undefined, undefined, undefined, 4)
      setRecommendedArticles(recommended)
    } catch (err) {
      console.error("Error loading recommended articles:", err)
    }
  }

  useEffect(() => {
    loadArticles()
    loadRecommendedArticles()
  }, [])

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1)
    loadArticles(newFilters, 1)
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      loadArticles(filters, currentPage + 1)
    }
  }

  const featuredArticles = articles.filter((article) => article.featured)
  const regularArticles = articles.filter((article) => !article.featured)

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => loadArticles()}>Réessayer</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles IA pour PME & Freelances</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Guides pratiques, études de cas et conseils d'experts pour intégrer l'intelligence artificielle dans votre
              activité professionnelle.
            </p>
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <AdvancedFilters
              onFiltersChange={handleFiltersChange}
              totalArticles={totalArticles}
              filteredCount={articles.length}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {recommendedArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recommandations intelligentes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-xl relative overflow-hidden">
                    {article.featured_image ? (
                      <img
                        src={article.featured_image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        {article.category?.name || "Non catégorisé"}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.reading_time || article.read_time} min</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(article.published_at).toLocaleDateString("fr-FR")}
                      </span>
                      <ArrowRight className="h-3 w-3 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Ad Placeholder */}
        <div className="mb-12">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 font-medium">[AD PLACEHOLDER - 728x90 Leaderboard]</p>
            <p className="text-sm text-gray-400 mt-2">TODO: Intégrer bannière publicitaire responsive</p>
          </div>
        </div>

        {articles.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche ou vos filtres.</p>
            <Button
              variant="outline"
              onClick={() =>
                handleFiltersChange({
                  sectors: [],
                  budgets: [],
                  levels: [],
                  readTime: [5, 30],
                  tags: [],
                  searchQuery: "",
                })
              }
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Articles à la une</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl relative overflow-hidden">
                    {article.featured_image ? (
                      <img
                        src={article.featured_image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-black/20"></div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        À la une
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {article.category?.name || "Non catégorisé"}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.published_at).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.reading_time || article.read_time} min</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={article.author?.avatar || "/placeholder.svg"}
                          alt={article.author?.name || "Auteur"}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm text-gray-700">{article.author?.name || "Auteur anonyme"}</span>
                      </div>
                      <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                        <span className="text-sm">Lire l'article</span>
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Regular Articles */}
        {regularArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Tous les articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl">
                    {article.featured_image && (
                      <img
                        src={article.featured_image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-t-xl"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {article.category?.name || "Non catégorisé"}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.reading_time || article.read_time} min</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {article.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(article.published_at).toLocaleDateString("fr-FR")}
                      </span>
                      <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                        <span className="text-sm">Lire</span>
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Load More */}
        {articles.length > 0 && currentPage < totalPages && (
          <div className="mt-12 text-center">
            <Button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? "Chargement..." : "Charger plus d'articles"}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Page {currentPage} sur {totalPages} • {totalArticles} articles au total
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ne manquez aucun article</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Recevez nos derniers guides et conseils IA directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
